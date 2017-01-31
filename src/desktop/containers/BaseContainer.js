import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { TextUtils, FirebaseManager, Alert } from '../../utils'


const BaseContainer = (Container, configuration) => {
	class Base extends Component {
		constructor(){
			super()
			// console.log('constructor: ' + configuration) // feed, account, postDetail, projectDetail
			let menu = []
			let selected = ''
			if (configuration == 'feed'){
				menu = ['Recent Activity', 'Projects', 'Notifications']
				selected = 'Recent Activity'
			}

			if (configuration == 'account'){
				menu = ['Profile', 'Projects']
				selected = 'Profile'
			}

			this.state = {
				selected: selected,
				menuItems: menu,
				notifications: null
			}
		}

		componentDidMount(){
			const user = this.props.account.currentUser
			if (user == null)
				return

			if (this.props.account.firebaseConnected == true)
				return

			FirebaseManager.register('/'+user.id+'/notifications', (err, notifications) => {
				if (err){
					return
				}

				if (notifications == null)
					return

				this.props.receivedNotifications(notifications)
			})
		}

		componentDidUpdate(){

		}

		selectItem(item, event){
			event.preventDefault()
			window.scrollTo(0, 0)

			const selected = (item.length == 0) ? event.target.value : item
			this.setState({
				selected: selected
			})
		}


		acceptInvitation(invitation){
			console.log('BASE CONTAINER - acceptInvitation')

			this.props.redeemInvitation(invitation)
			.then((response) => {
				const path = '/'+this.props.account.currentUser.id+'/notifications/'+invitation.id 
				FirebaseManager.post(path, null, () => {
					// remove invitation from firebase
				})

				if (response.type == null){
					window.location.href = '/feed'
					return
				}

				window.location.href = '/'+response.type+'/'+response.host.slug
			})
			.catch((err) => {
				this.setState({
					error: err
				})
			})
		}

		preparePost(post, type){
			const user = this.props.account.currentUser
			if (user == null){
				Alert.showAlert({
					title: 'Oops',
					text: 'Please log in or register to create a project.'
				})
				return null
			}

			post['saved'] = [user.id]
			post['type'] = type
			post['author'] = {
				id: user.id,
				name: user.username,
				slug: user.slug,
				image: (user.image.length == 0) ? null : user.image,
				type: 'profile'
			}

			if (type == 'project')
				post['collaborators'] = [Object.assign({}, post.author)]

			return post
		}		

		fetchData(req, params){
			console.log('fetchData: '+req+' == '+JSON.stringify(params))

			if (req == 'post'){
				this.props.fetchPosts(params)
				.then(response => {
					return response
				})
				.catch(err => {

				})
			}

			if (req == 'project'){
				this.props.fetchProjects(params)
				.then(response => {
					return response
				})
				.catch(err => {

				})
			}

			if (req == 'team'){
				this.props.fetchTeams(params)
				.then(response => {
					return response
				})
				.catch(err => {

				})
			}

			if (req == 'milestone'){
				this.props.fetchMilestones(params)
				.then(response => {
					return response
				})
				.catch(err => {

				})
			}
		}

		updateData(req, entity, params){
			const user = this.props.account.currentUser // every update requires login
			if (user == null){
				Alert.showAlert({
					title: 'Oops',
					text: 'Please register or log in.'
				})
				return
			}

			console.log('updateData: '+req+' == '+JSON.stringify(params))
			if (req == 'profile')
				return this.props.updateProfile(entity, params)
			
			if (req == 'post')
				return this.props.updatePost(entity, params)
		}

		postData(req, params, authRequired){
			const user = this.props.account.currentUser

			if (authRequired && user == null){
				Alert.showAlert({
					title: 'Oops',
					text: 'Please register or log in.'
				})
				return
			}

			if (req == 'team'){
//				console.log('BASE CONTAINER: Create Team')
				const membersList = [{id: user.id, username: user.username, image: user.image}]
				params['members'] = membersList
				params['admins'] = membersList
				let slug = null

				this.props.createTeam(params)
				.then((response) => {
					const result = response.result
					slug = result.slug
					let teamsArray = user.teams
					teamsArray.push(result.id)
					return this.props.updateProfile(user, {teams: teamsArray}) // update profile with teams array
				})
				.then(resp => { // this is the updated profile
					window.location.href = '/team/'+slug
				})
				.catch(err => {
					Alert.showAlert({
						title: 'Error',
						text: err
					})
				})
			}

			if (req == 'post'){
				const prepared = this.preparePost(params, 'hiring') // can be null
				if (prepared == null)
					return
				
				// find and remove any email strings:
				prepared['contact'] = TextUtils.findEmails(params.text)
				if (prepared.contact.length > 0){
					let text = prepared.text
					prepared.contact.forEach((email, i) => {
						text = text.replace(email, '')
					})
					prepared['text'] = text
				}

				this.props.createPost(prepared)
				.then(response => {
					browserHistory.push('/post/'+response.result.slug)
				})
				.catch(err => {
					Alert.showAlert({
						title: 'Error',
						text: err
					})
				})
			}

			if (req == 'project'){
				const prepared = this.preparePost(params, 'project') // can be null
				if (prepared == null)
					return

				let slug = null
				let project = {}
				this.props.createPost(prepared)
				.then(response => {
					project = response.result
					slug = project.slug
					let projects = user.projects
					projects.push(project.id)
					return this.props.updateProfile(user, {projects: projects})
				})
				.then(response => {
					const milestone = {
						title: user.username+' created a project!',
						description: user.username+' created the '+project.title+' project.',
						profile: {
							image: user.image,
							slug: user.slug,
							username: user.username,
							id: user.id
						},
						project: {
							image: project.image,
							slug: project.slug,
							title: project.title,
							id: project.id
						},
						teams: Object.assign([], user.teams)
					}

					return this.props.createMilestone(milestone)
				})
				.then(response => {
					browserHistory.push('/project/'+slug)
					return response
				})
				.catch(err => {
					alert(err)
				})
			}
		}

		render(){
			return (
				<div>
					<Container
						user={this.props.account.currentUser}
						menu={this.state.menuItems}
						onSelectItem={this.selectItem.bind(this)}
						selected={this.state.selected}
						fetchData={this.fetchData.bind(this)}
						updateData={this.updateData.bind(this)}
						postData={this.postData.bind(this)}
						redeem={this.acceptInvitation.bind(this)}
						receivedNotifications={this.props.receivedNotifications.bind(this)}
						{...this.props} />
				</div>
			)
		}
	}

	const stateToProps = (state) => {
		return {
			account: state.account,
			session: state.session
		}
	}

	const dispatchToProps = (dispatch) => {
		return {
			fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
			createPost: (params) => dispatch(actions.createPost(params)),
			fetchProjects: (params) => dispatch(actions.fetchProjects(params)),
			fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
			fetchMilestones: (params) => dispatch(actions.fetchMilestones(params)),
			createMilestone: (params) => dispatch(actions.createMilestone(params)),
			updateProfile: (profile, params) => dispatch(actions.updateProfile(profile, params)),
			updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
			redeemInvitation: (invitation) => dispatch(actions.redeemInvitation(invitation)),
			receivedNotifications: (notifications) => dispatch(actions.receivedNotifications(notifications))
		}
	}

	return connect(stateToProps, dispatchToProps)(Base)
}

export default BaseContainer