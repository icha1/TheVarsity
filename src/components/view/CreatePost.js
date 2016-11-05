import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { APIManager, DateUtils } from '../../utils'
import styles from './styles'

class CreatePost extends Component {
	constructor(){
		super()
		this.state = {
			post: {
				title: '',
				text: '',
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
			name: user.username,
			image: (user.image.length == 0) ? null : user.image
		}

		this.setState({
			post: updatedPost
		})
	}

	updatePost(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.post)
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
			image: (team.image.length == 0) ? null : team.image,
			type: 'team'
		}
		this.setState({post: updated})
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

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	submitPost(event){
		event.preventDefault()
//		console.log('submitPost: '+JSON.stringify(this.state.post))
		this.props.submit(this.state.post)
	}

	render(){
		const post = this.state.post
		const image = (post.image.length == 0) ? '/images/image-placeholder.png' : post.image
		const usernameOption = (this.props.user == null) ? null : <option value={this.props.user.id}>{ this.props.user.username }</option>
		const teamList = this.props.teams.map((team, i) => {
			return <option key={i} value={i}>{ team.name }</option>
		})

		const icon = (post.author.image == null) ? '/images/profile-icon.png' : post.author.image

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
							<input id="title" onChange={this.updatePost.bind(this)} type="text" placeholder="Title" style={styles.post.input} /><br />
							<textarea id="text" onChange={this.updatePost.bind(this)} placeholder="Text:" style={styles.post.textarea}></textarea><br />					
						</div>

						<Dropzone onDrop={this.uploadImage.bind(this)} className="col_one_third col_last" style={{marginBottom:4}}>
							<img style={styles.post.postImage} src={image} />
						</Dropzone>
					</div>
					<hr />
					<h4 style={styles.post.header}>
						<a href='#' style={styles.post.title}>{ post.author.name }</a>
					</h4>
					<span>address</span><br />
					<span>{ DateUtils.today() }</span>
				</div>

				<br />
				<label>Post As</label>
				<select id="author" onChange={this.updatePost.bind(this)} className="form-control" style={styles.post.select}>
					{ usernameOption }
					{ teamList }
				</select>

				<a href="#" onClick={this.submitPost.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Create Event</a>
				<a href="#" onClick={this.cancel.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Cancel</a>
			</div>
		)
	}
}

export default CreatePost