import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { APIManager, DateUtils } from '../../utils'
import { Post } from '../view'
import store from '../../stores/store'
import actions from '../../actions/actions'
import styles from './styles'

class Posts extends Component {
	constructor(){
		super()
		this.fetchPosts = this.fetchPosts.bind(this)
		this.state = {
			showCreatePost: false,
			post: {
				title: '',
				text: '',
				type: '',
				image: '',
				profile: {},
				team: {}
			}
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

			store.currentStore().dispatch(actions.postsReceived(response.results))
			this.setState({showCreatePost: false})
		})		
	}

	updatePost(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.post)
		updated[event.target.id] = event.target.value
		this.setState({
			post: updated
		})
	}

	submitPost(event){
		event.preventDefault()
		console.log('submitPost: '+JSON.stringify(this.state.post))
	}

	uploadImage(files){
		APIManager.upload(files[0], (err, image) => {
			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.post)
			updated['image'] = image.address
			this.setState({post: updated})
		})
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

		const teamList = this.props.teams.map((team, i) => {
			return <option key={i} value={team.id}>{ team.name }</option>
		})

		const image = (this.state.post.image.length == 0) ? '/images/image-placeholder.png' : this.state.post.image
		let createPost = (
			<li className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
				<div className={styles.post.container.className} style={styles.post.container}>
					<div className="comment-meta">
						<div className="comment-author vcard">
							<span className="comment-avatar clearfix">
							<img alt='The Varsity' src={'/images/profile-icon.png'} className='avatar avatar-60 photo' height='60' width='60' /></span>
						</div>
					</div>

					<div className={styles.post.content.className} style={styles.post.content}>
						<div className="col_two_third" style={{marginBottom:4}}>
							<input id="title" onChange={this.updatePost.bind(this)} type="text" placeholder="Title" style={styles.post.input} /><br />
							<textarea id="text" onChange={this.updatePost.bind(this)} placeholder="Text:" style={styles.post.textarea}></textarea><br />					
						</div>

						<Dropzone onDrop={this.uploadImage.bind(this)} className="col_one_third col_last" style={{marginBottom:4}}>
							<img style={styles.post.postImage} src={image} />
						</Dropzone>
					</div>
					<hr />
					<h4 style={styles.post.header}>
						<a href='#' style={styles.post.title}>{ this.state.post.profile.username }</a>
					</h4>
					<span>address</span><br />
					<span>{ DateUtils.today() }</span>
				</div>

				<select className="form-control" style={styles.post.select}>
					<option>Events</option>
					<option>News</option>
				</select>
				<select className="form-control" style={styles.post.select}>
					{ teamList }
				</select>

				<a href="#" onClick={this.submitPost.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Create Post</a>
				<a href="#" onClick={this.toggleCreatePost.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Cancel</a>

			</li>
		)

		return (
			<div>
				<ol className="commentlist noborder nomargin nopadding clearfix">
					{ (this.state.showCreatePost) ? createPost : currentPosts }
				</ol>
				<a href="#" onClick={this.toggleCreatePost.bind(this)} style={{position:'fixed', bottom:0}} className={styles.post.btnAdd.className}>Add Post</a>
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

export default connect(stateToProps)(Posts)
