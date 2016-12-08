import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { Link } from 'react-router'
import { DateUtils, TextUtils, APIManager } from '../../utils'
import styles from './styles'

class EditProfile extends Component {
	constructor(){
		super()
		this.state = {
			updatedProfile: {
				changed: false,
				image: ''
			}
		}
	}

	componentDidMount(){
		let updated = Object.assign({}, this.state.updatedProfile)
		updated['image'] = this.props.profile.image
		this.setState({
			updatedProfile: updated
		})
	}

	btnCloseClicked(event){
		event.preventDefault()
		if (this.state.updatedProfile.changed){
			let updated = Object.assign({}, this.state.updatedProfile)
			delete updated['changed']
			this.props.update(updated)
			return
		}

		this.props.close()
	}

	updateProfile(event){
		let updated = Object.assign({}, this.state.updatedProfile)
		updated[event.target.id] = event.target.value
		updated['changed'] = true
		this.setState({
			updatedProfile: updated
		})
	}

	uploadImage(files){
		APIManager.upload(files[0], (err, image) => {
			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.updatedProfile)
			updated['image'] = image.address
			updated['changed'] = true
			this.setState({
				updatedProfile: updated
			})
		})
	}

	render(){
		const profile = this.props.profile
		const image = (this.state.updatedProfile.image.length == 0) ? '/images/image-placeholder.png' : this.state.updatedProfile.image+'=s220-c'

		return (
			<div className={styles.post.container.className} style={styles.post.container}>
				<button onClick={this.btnCloseClicked.bind(this)} style={{float:'right'}}>Done</button>
				<h2 style={styles.post.title}>Update Profile</h2>
				<Dropzone onDrop={this.uploadImage.bind(this)} style={{marginBottom:4}}>
					<img style={styles.post.postImage} src={image} />
				</Dropzone>
				<hr />
				<input type="text" id="title" placeholder="Title (Web Designer, Photographer, etc)" style={{border:'none', background:'#F8F9F9', width:'100%', padding:8, marginBottom:12}} onChange={this.updateProfile.bind(this)} defaultValue={profile.title} />
				<textarea id="bio" placeholder="Bio" onChange={this.updateProfile.bind(this)} style={{border:'none', background:'#F8F9F9', width:'100%', minHeight:220, padding:8, resize:'none'}} defaultValue={profile.bio}></textarea>
			</div>
		)
	}
}


export default EditProfile