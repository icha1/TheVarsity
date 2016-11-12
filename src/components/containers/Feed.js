import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { APIManager, DateUtils, FirebaseManager } from '../../utils'
import { Post, CreatePost, CreateTeam, TeamPreview, Comment } from '../view'
import store from '../../stores/store'
import constants from '../../constants/constants'
import actions from '../../actions/actions'
import styles from './styles'

class Feed extends Component {
	constructor(){
		super()
		this.fetchPosts = this.fetchPosts.bind(this)
		this.showChat = this.showChat.bind(this)
		this.state = {
			showCreate: false,
			comment: {
				profile: null,
				text: '',
				image: ''
			}
		}
	}

	componentDidMount(){
		store.currentStore().subscribe(() => {
			setTimeout(() => { // this is a sloppy workaround
//				console.log('RELOAD: ' + this.props.session.selectedFeed +', '+ this.props.session.reload)
				if (this.props.session.reload){ // check selected feed
					const selectedFeed = this.props.session.selectedFeed
					if (selectedFeed == constants.FEED_TYPE_EVENT || selectedFeed == constants.FEED_TYPE_NEWS)
						this.fetchPosts()

					else if (selectedFeed == constants.FEED_TYPE_CHAT)
						this.showChat()
					
				}
			}, 5)
		})
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

	fetchPosts(){
		const session = this.props.session
		const params = {
			limit: 10,
			type: session.selectedFeed,
			lat: session.currentLocation.lat,
			lng: session.currentLocation.lng
		}

		console.log('FETCH POSTS: '+JSON.stringify(params))

		APIManager.handleGet('/api/post', params, (err, response) => {
			if (err){
				alert(err)
				return
			}

			this.props.postsReceived(response.results)
			this.setState({showCreate: false})
		})
	}

	showChat(){
		console.log('showChat: ')
	}

	submitPost(post){
		const session = this.props.session
		post['district'] = session.currentDistrict.id
		const currentLocation = session.currentLocation
		post['geo'] = [
			currentLocation.lat,
			currentLocation.lng
		]

		console.log('submitPost: '+JSON.stringify(post))
		
		APIManager.handlePost('/api/post', post, (err, response) => {
			if (err){
				alert(err)
				return
			}

			this.props.postCreated(response.result)
			this.setState({showCreate: false})
			window.scrollTo(0, 0)
		})
	}

	createTeam(team){
		const district = this.props.session.district
		team['district'] = district.id

		let address = Object.assign({}, team.address)
		address['city'] =  district.city
		address['state'] = district.state
		team['address'] = address

//		console.log('createTeam: '+JSON.stringify(team))

		this.props.toggleLoader(true)
		APIManager.handlePost('/api/team', team, (err, response) => {
			this.props.toggleLoader(false)
			if (err){
				alert(JSON.stringify(err))
				return
			}

			console.log('TEAM CREATED: '+JSON.stringify(response))
			this.setState({showCreate: false})
		})		
	}

	updateComment(event){
//		console.log('UpdateComment: '+event.target.value)
		let updated = Object.assign({}, this.state.comment)
		updated['text'] = event.target.value
		this.setState({
			comment: updated
		})
	}

	keyPress(event){
		if (event.keyCode != 13)
			return

		if (this.props.user == null){
			alert('Please log in or register to post a comment.')
			return
		}

		if (this.props.session.currentDistrict.id == null) // no current district
			return

		let updated = Object.assign({}, this.state.comment)
		updated['profile'] = {
			id: this.props.user.id,
			username: this.props.user.username,
			image: this.props.user.image
		}

		const currentDistrict = this.props.session.currentDistrict
		const path = '/comments/'+currentDistrict.id+'/'+currentDistrict.comments.length
		FirebaseManager.post(path, updated, () => {
			console.log('callback test') // TODO: post comment to API
		})

		this.setState({ // reset comment
			comment: {
				profile: null,
				text: '',
				image: ''
			}
		})
	}

	render(){
		const feed = this.props.session.selectedFeed
		let currentFeed = null
		let create = null

		const listClass = 'commentlist noborder nomargin nopadding clearfix'
		const listItemClass = 'comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1'

		if (feed == constants.FEED_TYPE_EVENT || feed == constants.FEED_TYPE_NEWS){ 
			const list = this.props.posts[feed]
			if (list != null){
				currentFeed = (
					<ol className={listClass}>
						{
							list.map((post, i) => {
								return (
									<li key={post.id} className={listItemClass} id="li-comment-2">
										<Post post={post} />
									</li>
								)
							})
						}
					</ol>
				)
			}

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
			currentFeed = (
				<ol className={listClass}>
					{
						this.props.session.teams.map((team, i) => {
							return (
								<li key={team.id} className={listItemClass} id="li-comment-2">
									<TeamPreview team={team} />
								</li>
							)
						})
					}
				</ol>
			)

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
					<div style={{padding:16, background:'#ffffe6', borderTop:'1px solid #ddd'}}>
						<input value={this.state.comment.text} onKeyUp={this.keyPress.bind(this)} onChange={this.updateComment.bind(this)} type="text" className="form-control" />
					</div>
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
		posts: state.post.feed,
		user: state.account.currentUser,
		teams: state.account.teams,
		session: state.session // district, currentLocation, teams, selectedFeed, reload
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postsReceived: posts => dispatch(actions.postsReceived(posts)),
		postCreated: post => dispatch(actions.postCreated(post)),
		toggleLoader: isLoading => dispatch(actions.toggleLoader(isLoading))
	}
}

export default connect(stateToProps, mapDispatchToProps)(Feed)
