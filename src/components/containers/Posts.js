import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { APIManager, DateUtils } from '../../utils'
import { Post, CreatePost } from '../view'
import store from '../../stores/store'
import actions from '../../actions/actions'
import styles from './styles'

class Posts extends Component {
	constructor(){
		super()
		this.fetchPosts = this.fetchPosts.bind(this)
		this.state = {
			showCreatePost: false
		}
	}

	componentDidMount(){
		store.currentStore().subscribe(() => {
			setTimeout(() => { // this is a sloppy workaround
				console.log('RELOAD: ' + this.props.selectedFeed +', '+ this.props.reload)
				if (this.props.reload)
					this.fetchPosts()
			}, 5)
		})

		this.fetchPosts()
	}

	toggleCreatePost(event){
		if (event != null)
			event.preventDefault()

		window.scrollTo(0, 0)
		this.setState({
			showCreatePost: !this.state.showCreatePost
		})
	}

	fetchPosts(){
		const params = {
			limit: 10,
			type: this.props.selectedFeed,
			lat: this.props.location.lat,
			lng: this.props.location.lng
		}

		APIManager.handleGet('/api/post', params, (err, response) => {
			if (err){
				alert(err)
				return
			}

			this.props.postsReceived(response.results)
			this.setState({showCreatePost: false})
		})		
	}

	submitPost(post){
		// event.preventDefault()
		console.log('submitPost: '+JSON.stringify(post))
	}

	render(){
		const list = this.props.posts[this.props.selectedFeed]
		let currentPosts = null
		if (list != null){
			currentPosts = list.map((post, i) => {
				return (
					<li key={post.id} className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
						<Post post={post} />
					</li>
				)
			})
		}

		let createPost = (
			<CreatePost 
				user={this.props.user}
				teams={this.props.teams}
				submit={this.submitPost.bind(this)}
				cancel={this.toggleCreatePost.bind(this)} />
		)

		return (
			<div>
				<ol className="commentlist noborder nomargin nopadding clearfix">
					<li className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
						{ (this.state.showCreatePost) ? createPost : currentPosts }
					</li>
				</ol>

				{ (this.state.showCreatePost) ? null : <a href="#" onClick={this.toggleCreatePost.bind(this)} style={{position:'fixed', bottom:0}} className={styles.post.btnAdd.className}>Add Event</a> }
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		posts: state.post.feed,
		location: state.session.currentLocation,
		selectedFeed: state.session.selectedFeed,
		reload: state.session.reload,
		user: state.account.currentUser,
		teams: state.account.teams
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postsReceived: posts => dispatch(actions.postsReceived(posts))
	}
}

export default connect(stateToProps, mapDispatchToProps)(Posts)
