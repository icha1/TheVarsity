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
				street: '',
				image: '',
				invited: ''
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

			let updated = Object.assign({}, this.state.team)
			updated['image'] = image.address
			this.setState({team: updated})
		})
	}	

	updateTeam(event){
		let updated = Object.assign({}, this.state.team)
		updated[event.target.id] = event.target.value
		this.setState({
			team: updated
		})
	}

	submitTeam(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.team)
		let members = []
		updated.invited.split(',').forEach((member, i) => {
			members.push(member.trim())
		})

		updated['members'] = members
		delete updated['invited']

		updated['address'] = {
			street: updated.street,
			city: '',
			state: ''
		}
		delete updated['street']

		updated['social'] = {
			instagram: updated.instagram,
			facebook: updated.facebook,
		}
		delete updated['instagram']
		delete updated['facebook']

		this.props.submit(updated)
	}

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	render(){
		const team = this.state.team
		const image = (team.image.length == 0) ? '/images/image-placeholder.png' : team.image+'=s220-c'
		const icon = (team.image.length == 0) ? '/images/profile-icon.png' : team.image+'=s120-c'

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
							<input id="name" onChange={this.updateTeam.bind(this)} type="text" placeholder="Team Name" style={styles.post.input} /><br />
							<textarea id="description" onChange={this.updateTeam.bind(this)} placeholder="Description" style={styles.post.textarea}></textarea><br />					
						</div>

						<Dropzone onDrop={this.uploadImage.bind(this)} className="col_one_third col_last" style={{marginBottom:4}}>
							<img style={styles.post.postImage} src={image} />
						</Dropzone>
					</div>
				</div>
				<br />
				<label>Address</label>
				<input id="street" onChange={this.updateTeam.bind(this)} type="text" placeholder="123 Main St." style={styles.post.select} className="form-control" /><br />

				<label>Invite Members</label>
				<input id="invited" onChange={this.updateTeam.bind(this)} type="text" placeholder="address@example.com, address2@example2.com, address3@example3.com" style={styles.post.select} className="form-control" /><br />

				<label>Social</label>
				<input id="instagram" onChange={this.updateTeam.bind(this)} type="text" placeholder="Instagram Username" style={styles.post.select} className="form-control" />
				<input id="facebook" onChange={this.updateTeam.bind(this)} type="text" placeholder="Facebook Page Name" style={styles.post.select} className="form-control" /><br />

				<a href="#" onClick={this.submitTeam.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Create Team</a>
				<a href="#" onClick={this.cancel.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Cancel</a>
			</div>
		)
	}
}

export default CreateTeam