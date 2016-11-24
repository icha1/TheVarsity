import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { APIManager, DateUtils, FirebaseManager } from '../../utils'
import { PostFeed, CreatePost, CreateTeam, TeamFeed, Comment, CreateComment } from '../view'
import constants from '../../constants/constants'
import actions from '../../actions/actions'
import styles from './styles'

class Feed extends Component {
	constructor(){
		super()
		this.state = {
			showCreate: false,
			commentsLoaded: false
		}
	}

	toggleShowCreate(event){
		if (event != null)
			event.preventDefault()

		window.scrollTo(0, 0)
		this.setState({
			showCreate: !this.state.showCreate
		})
	}

	toggleLoader(isLoading){
		this.props.toggleLoader(isLoading)
	}

	submitPost(post){
		if (this.props.user == null){
			alert('Please log in or register to submit.')
			return
		}

		const session = this.props.session
		post['district'] = session.currentDistrict.id
		const currentLocation = session.currentLocation
		post['geo'] = [
			currentLocation.lat,
			currentLocation.lng
		]

		console.log('submitPost: '+JSON.stringify(post))

		this.props.toggleLoader(true)
		APIManager.handlePost('/api/post', post)
		.then((response) => {
			this.props.toggleLoader(false)
			this.props.postCreated(response.result)
			this.setState({showCreate: false})
			window.scrollTo(0, 0)
		})
		.catch((err) => {
			this.props.toggleLoader(false)
			this.setState({showCreate: false})
		})
	}

	createTeam(team){
		if (this.props.user == null){
			alert('Please log in or register to create a team.')
			return
		}

		team['members'] = [{id: this.props.user.id, username: this.props.user.username, image: this.props.user.image}]

		const district = this.props.session.currentDistrict
		team['district'] = district.id

		let address = Object.assign({}, team.address)
		address['city'] =  district.city
		address['state'] = district.state
		team['address'] = address

		this.props.createTeam(team)
	}

	submitComment(comment){
		if (this.props.user == null){
			alert('Please log in or register to post a comment.')
			return
		}

		if (this.props.session.currentDistrict.id == null) // no current district
			return

		let updated = Object.assign({}, comment)
		updated['timestamp'] = new Date().getTime()
		updated['profile'] = {
			id: this.props.user.id,
			username: this.props.user.username,
			image: this.props.user.image
		}

		console.log('submitComment: '+JSON.stringify(updated))

		const currentDistrict = this.props.session.currentDistrict
		const path = '/'+currentDistrict.id+'/comments/'+currentDistrict.comments.length
		FirebaseManager.post(path, updated, () => {
			console.log('callback test') // TODO: post comment to API
		})
	}

	savePost(post){
		const user = this.props.user
		if (user == null){
			alert('Please register or log in to save this post.')
			return
		}

		if (post.saved.indexOf(user.id) != -1){
			alert('Already Saved')
			return
		}

//		console.log('SAVE POST: '+JSON.stringify(post))
		this.props.savePost(post, user)
	}

	componentDidUpdate(){
		const session = this.props.session
		const feed = session.selectedFeed
		if (feed == constants.FEED_TYPE_NEWS || feed == constants.FEED_TYPE_EVENT){ 
			const list = this.props.post.feed[feed]
			if (list != null) // already there, no need to fetch
				return

			if (session.currentDistrict.id == null)
				return null

			if (this.props.post.isFetching) // in the middle of a fetch
				return null

			const params = {
				limit: 10,
				type: feed,
				lat: session.currentLocation.lat,
				lng: session.currentLocation.lng
			}

			this.props.fetchPosts(params)
		}

		if (feed == constants.FEED_TYPE_CHAT){
			if (session.currentDistrict.id == null)
				return null

			if (this.state.commentsLoaded == true) // already connected
				return

			const path = '/'+session.currentDistrict.id+'/comments/'
			FirebaseManager.register(path, (err, comments) => {
				if (err)
					return
				
				if (comments == null)
					return

				this.setState({commentsLoaded: true})
				this.props.commentsReceived(comments)
			})
		}
	}

	render(){
		const feed = this.props.session.selectedFeed
		let currentFeed = null
		let create = null

		const listClass = 'commentlist noborder nomargin nopadding clearfix'
		const listItemClass = 'comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1'

		if (feed == constants.FEED_TYPE_NEWS || feed == constants.FEED_TYPE_EVENT){ 
			const list = this.props.post.feed[feed]
			currentFeed = (list) ? <PostFeed savePost={this.savePost.bind(this)} posts={list} user={this.props.user} /> : null

			create = (
				<ol className={listClass}>
					<li className={listItemClass} id="li-comment-2">
						<CreatePost
							type={this.props.session.selectedFeed}
							user={this.props.user}
							teams={this.props.teams}
							isLoading={this.toggleLoader.bind(this)}
							submit={this.submitPost.bind(this)}
							cancel={this.toggleShowCreate.bind(this)} />
					</li>
				</ol>
			)			
		}

		if (feed == constants.FEED_TYPE_TEAM){
			currentFeed = <TeamFeed teams={this.props.session.teams} user={this.props.user} />

			create = (
				<ol className={listClass}>
					<li className={listItemClass} id="li-comment-2">
						<CreateTeam
							user={this.props.user}
							isLoading={this.toggleLoader.bind(this)}
							submit={this.createTeam.bind(this)}
							cancel={this.toggleShowCreate.bind(this)} />
					</li>
				</ol>
			)
		}

		const btnCreate = (this.state.showCreate==false && feed!=constants.FEED_TYPE_CHAT) ? <a href="#" onClick={this.toggleShowCreate.bind(this)} style={{position:'fixed', bottom:0}} className={styles.post.btnAdd.className}>Add {feed}</a> : null

		if (feed == constants.FEED_TYPE_CHAT){
			currentFeed = (
				<div style={{overflowY:'scroll', borderRight:'1px solid #ddd', borderLeft:'1px solid #ddd', borderBottom:'1px solid #ddd'}}>
					<CreateComment onCreate={this.submitComment.bind(this)} />
					{
						this.props.session.currentDistrict.comments.map((comment, i) => {
							return <Comment comment={comment} key={i} />
						})
					}
				</div>
			)
		}

		return (
			<div>
				{ (this.state.showCreate) ? create : currentFeed }
				{ btnCreate }
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		post: state.post,
		user: state.account.currentUser,
		teams: state.account.teams,
		session: state.session // district, currentLocation, teams, selectedFeed, reload
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchPosts: params => dispatch(actions.fetchPosts(params)),
		postsReceived: posts => dispatch(actions.postsReceived(posts)),
		postCreated: post => dispatch(actions.postCreated(post)),
		savePost: (post, profile) => dispatch(actions.savePost(post, profile)),
		commentsReceived: comments => dispatch(actions.commentsReceived(comments)),
		toggleLoader: isLoading => dispatch(actions.toggleLoader(isLoading)),
		createTeam: team => dispatch(actions.createTeam(team))
	}
}

export default connect(stateToProps, mapDispatchToProps)(Feed)
