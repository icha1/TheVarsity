import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import constants from '../../constants/constants'
import { APIManager, DateUtils } from '../../utils'
import styles from './styles'

class CreatePost extends Component {
	constructor(){
		super()
		this.state = {
			post: {
				title: '',
				text: '', // event, news, etc.
				type: '',
				image: '',
				author: {

				}
			}
		}
	}

	componentDidMount(){
		const user = this.props.user
		let updatedPost = Object.assign({}, this.state.post)
		updatedPost['author'] = {
			id: user.id,
			type: 'profile',
			slug: user.username,
			name: user.username,
			image: (user.image.length == 0) ? null : user.image // TODO: insert placeholder icon
		}

		this.setState({
			post: updatedPost
		})
	}

	updatePost(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.post)
		if (this.props.type == constants.FEED_TYPE_NEWS){
			if (event.target.id == 'title'){ // check if title is url
				console.log('TITLE = '+event.target.value)
			    if (event.target.value.indexOf("http://") == 0 || event.target.value.indexOf("https://") == 0) {
					console.log('FETCH URL = '+event.target.value)

					const params = {
						url: event.target.value
					}

					APIManager
					.handleGet('/tags', params)
					.then((response) => {
						const tags = response.tags // title, image, description
						updated['title'] = tags.title
						updated['image'] = tags.image
						updated['text'] = tags.description
						updated['url'] = tags.url
						this.setState({post: updated})
					})
					.catch((err) => {

					})
					return
			    }
			}
		}


		if (event.target.id != 'author'){
			updated[event.target.id] = event.target.value
			this.setState({post: updated})
			return
		}

		console.log('author = '+event.target.value)
		if (event.target.value == this.props.user.id){
			const user = this.props.user
			updated['author'] = {
				id: user.id,
				name: user.username,
				slug: user.username,
				image: (user.image.length == 0) ? null : user.image,
				type: 'profile'
			}
			this.setState({post: updated})
			return
		}

		const team = this.props.teams[event.target.value]

		updated['author'] = {
			id: team.id,
			name: team.name,
			slug: team.slug,
			image: (team.image.length == 0) ? null : team.image,
			type: 'team'
		}
		this.setState({post: updated})
	}

	uploadImage(files){
		this.props.isLoading(true)
		APIManager.upload(files[0], (err, image) => {
			this.props.isLoading(false)
			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.post)
			updated['image'] = image.address+'=s220-c'
			this.setState({post: updated})
		})
	}

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	submitPost(event){
		event.preventDefault()

		let updated = Object.assign({}, this.state.post)
		updated['type'] = this.props.type
		this.props.submit(updated)
	}

	render(){
		const post = this.state.post
		const image = (post.image.length == 0) ? '/images/image-placeholder.png' : post.image
		const usernameOption = (this.props.user == null) ? null : <option value={this.props.user.id}>{ this.props.user.username }</option>
		const teamList = this.props.teams.map((team, i) => {
			return <option key={i} value={i}>{ team.name }</option>
		})

		const icon = (post.author.image == null) ? '/images/profile-icon.png' : post.author.image
		const placeholder = (this.props.type == constants.FEED_TYPE_EVENT) ? 'Event Title' : 'Title or URL to link'

		return (
			<div>
				<div className={styles.post.container.className} style={styles.post.container}>
					<div className="comment-meta">
						<div className="comment-author vcard">
							<span className="comment-avatar clearfix">
							<img alt='The Varsity' src={icon} className='avatar avatar-60 photo' height='60' width='60' /></span>
						</div>
					</div>

					<div className={styles.post.content.className} style={styles.post.content}>
						<div className="col_two_third" style={{marginBottom:4}}>
							<input id="title" onChange={this.updatePost.bind(this)} type="text" value={post.title} placeholder={placeholder} style={styles.post.input} /><br />
							<textarea id="text" onChange={this.updatePost.bind(this)} value={post.text} placeholder="Text" style={styles.post.textarea}></textarea><br />					
						</div>

						<Dropzone onDrop={this.uploadImage.bind(this)} className="col_one_third col_last" style={{marginBottom:4}}>
							<img style={styles.post.postImage} src={image} />
						</Dropzone>
					</div>
					<hr />
					<h4 style={styles.post.header}>
						<a href='#' style={styles.post.title}>{ post.author.name }</a>
					</h4>
					<span>{ DateUtils.today() }</span><br />
					<a href="#" style={{marginLeft: 0}} className="button button-mini button-circle button-red">{ this.props.type }</a>
					<hr />
					<label>Post From</label>
					<select id="author" onChange={this.updatePost.bind(this)} style={{border:'none', marginLeft:12}}>
						{ usernameOption }
						{ teamList }
					</select>
				</div>
				<br />

				<a href="#" onClick={this.submitPost.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Submit</a>
				<a href="#" onClick={this.cancel.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Cancel</a>
			</div>
		)
	}
}

export default CreatePost