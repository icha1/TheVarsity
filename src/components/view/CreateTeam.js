import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { APIManager, DateUtils } from '../../utils'
import styles from './styles'

class CreateTeam extends Component {
	constructor(){
		super()
		this.state = {
			team: {
				name: '',
				description: '',
				image: ''
			}
		}
	}

	uploadImage(files){
		this.props.isLoading(true)
		APIManager.upload(files[0], (err, image) => {
			this.props.isLoading(false)
			if (err){
				alert(err)
				return
			}

			// let updated = Object.assign({}, this.state.post)
			// updated['image'] = image.address+'=s220-c'
			// this.setState({post: updated})
		})
	}	

	updateTeam(event){

	}

	submitTeam(){
		event.preventDefault()

	}

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	render(){
		const team = this.state.team
		const image = (team.image.length == 0) ? '/images/image-placeholder.png' : team.image

		return (
			<div>
				<div className={styles.post.container.className} style={styles.post.container}>
					<div className="comment-meta">
						<div className="comment-author vcard">
							<span className="comment-avatar clearfix">
							<img alt='The Varsity' src={'/images/profile-icon.png'} className='avatar avatar-60 photo' height='60' width='60' /></span>
						</div>
					</div>

					<div className={styles.post.content.className} style={styles.post.content}>
						<div className="col_two_third" style={{marginBottom:4}}>
							<input id="title" onChange={this.updateTeam.bind(this)} type="text" placeholder="Team Name" style={styles.post.input} /><br />
							<textarea id="text" onChange={this.updateTeam.bind(this)} placeholder="Description" style={styles.post.textarea}></textarea><br />					
						</div>

						<Dropzone onDrop={this.uploadImage.bind(this)} className="col_one_third col_last" style={{marginBottom:4}}>
							<img style={styles.post.postImage} src={image} />
						</Dropzone>

					</div>
				</div>
				<br />
				<label>Address</label>
				<input id="street" type="text" placeholder="123 Main St." style={styles.post.select} className="form-control" /><br />

				<label>Invite Members</label>
				<input id="members" type="text" placeholder="address@example.com, address2@example2.com, address3@example3.com" style={styles.post.select} className="form-control" /><br />

				<a href="#" onClick={this.submitTeam.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Create Team</a>
				<a href="#" onClick={this.cancel.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Cancel</a>

			</div>
		)
	}
}

export default CreateTeam