import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import { Link } from 'react-router'
import { DateUtils, TextUtils, APIManager } from '../../utils'
import styles from './styles'

class EditProfile extends Component {
	constructor(){
		super()
		this.state = {
			isLoading: false,
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
		this.setState({isLoading: true})
		APIManager.upload(files[0], (err, image) => {
			this.setState({isLoading: false})
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
			<div>
				<input type="text" id="title" placeholder="Title (Photographer, etc)" style={localStyle.input} onChange={this.updateProfile.bind(this)} defaultValue={profile.title} />
				<input type="text" id="username" placeholder="Username" style={localStyle.input} onChange={this.updateProfile.bind(this)} defaultValue={profile.username} />
				<textarea id="bio" placeholder="Bio" onChange={this.updateProfile.bind(this)} style={localStyle.textarea} defaultValue={profile.bio}></textarea>
				<Dropzone onDrop={this.uploadImage.bind(this)} className="clearfix visible-md visible-lg">
					{ (this.state.updatedProfile.image.length > 0) ? <div><img src={image} /><br />Click to Change</div> :
						<button className="social-icon si-small si-borderless si-instagram">
							<i className="icon-instagram"></i>
							<i className="icon-instagram"></i>
						</button>
					}
					<div style={{float:'right', width:50+'%'}}>
						{ (this.state.isLoading) ? <Loading type='bars' color='#333' /> : null }
					</div>
				</Dropzone>	            
	            <a href="#" onClick={this.btnCloseClicked.bind(this)} className="button button-circle button-green" style={localStyle.btnBlue}>Done</a>
			</div>
		)
	}
}

const localStyle = {
	btnBlue: {
		float: 'right',
		className: 'button button-small button-circle button-blue'
	},
	input: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	textarea: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 16,
		border: 'none',
		width: 100+'%',
		fontFamily:'Pathway Gothic One',
		minHeight: 220
	}
}

export default EditProfile