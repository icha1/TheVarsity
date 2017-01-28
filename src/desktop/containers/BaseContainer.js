import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Link } from 'react-router'
import { TextUtils, FirebaseManager } from '../../utils'


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

			this.state = {
				selected: selected,
				menuItems: menu,
				firebaseConnected: false,
				notifications: null
			}
		}

		selectItem(item, event){
			event.preventDefault()
			window.scrollTo(0, 0)

			const selected = (item.length == 0) ? event.target.value : item
			this.setState({
				selected: selected
			})
		}

		componentDidUpdate(){
//			console.log('BASE CONTAINER - componentDidUpdate')

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


		render(){
			return (
				<div>
					<Container
						user={this.props.account.currentUser}
						menu={this.state.menuItems}
						onSelectItem={this.selectItem.bind(this)}
						selected={this.state.selected}
						fetchData={this.fetchData.bind(this)}
						redeem={this.acceptInvitation.bind(this)}
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
			fetchProjects: (params) => dispatch(actions.fetchProjects(params)),
			fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
			fetchMilestones: (params) => dispatch(actions.fetchMilestones(params)),
			redeemInvitation: (invitation) => dispatch(actions.redeemInvitation(invitation))
		}
	}

	return connect(stateToProps, dispatchToProps)(Base)
}

export default BaseContainer