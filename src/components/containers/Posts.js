import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { APIManager } from '../../utils'
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
				image: ''
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

	uploadImage(files){

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
			<li className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
				<div className={styles.post.container.className} style={styles.post.container}>
					<div className="comment-meta">
						<div className="comment-author vcard">
							<span className="comment-avatar clearfix">
							<img alt='The Varsity' src={'https://lh3.googleusercontent.com/OfmWs4W8_286PjOrshncso1VYO6iAvVBmrr9Kgr6lISSz-5uWo_tF7Fl-KtKrPeylWmFEkt9k0j9xmFlEPR6XGEO8P8=s120-c'} className='avatar avatar-60 photo' height='60' width='60' /></span>
						</div>
					</div>

					<div className={styles.post.content.className} style={styles.post.content}>
						<div className="col_two_third" style={{marginBottom:4}}>
							<input type="text" placeholder="Title" style={styles.post.input} /><br />
							<textarea placeholder="Text:" style={styles.post.textarea}></textarea><br />					
						</div>

						<Dropzone onDrop={this.uploadImage.bind(this)} className="col_one_third col_last" style={{marginBottom:4}}>
							<img style={styles.post.postImage} src={'/images/image-placeholder.png'} />
						</Dropzone>
					</div>

					<hr />
					<a href="#" onClick={this.toggleCreatePost.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Create</a>
				</div>
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
		reload: state.session.reload
	}
}

export default connect(stateToProps)(Posts)
