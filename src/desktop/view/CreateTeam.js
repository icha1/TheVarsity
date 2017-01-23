import React, { Component } from 'react'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import Dropzone from 'react-dropzone'
import { APIManager, DateUtils, Alert, TextUtils } from '../../utils'
import styles from './styles'

class CreateTeam extends Component {
	constructor(){
		super()
		this.state = {
			isLoading: false,
			team: {
				name: '',
				type: 'software',
				description: '',
				// street: '',
				image: '',
			}
		}
	}

	uploadImage(files){
		this.setState({
			isLoading: true
		})

		APIManager.upload(files[0], (err, image) => {
			this.setState({
				isLoading: false
			})

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
		let message = {title: 'Oops'}
		if (updated.name.length == 0){
			message['text'] = 'Please enter a team name.'
			Alert.showAlert(message)
			return
		}

		if (updated.name.description == 0){
			message['text'] = 'Please enter a team description.'
			Alert.showAlert(message)
			return
		}

		if (updated.otherCategory != null)
			updated['type'] = updated.otherCategory

		if (updated.image.length == 0) // defer to default if no image specified
			delete updated['image']

		this.props.submit(updated)
	}

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	render(){
		const team = this.state.team
		const image = (team.image.length == 0) ? '/images/image-placeholder.png' : team.image+'=s140-c'

		return (
			<div style={localStyle.container}>
				<h3 style={localStyle.title}>Create Team</h3>
				<hr />
				<Dropzone onDrop={this.uploadImage.bind(this)} style={{marginBottom:4, textAlign:'center', border:'none'}}>
					<img style={localStyle.teamImage} src={image} /> 
					<div style={{margin:'auto', width:40+'%', background:'#f9f9f9'}}>
						{ (this.state.isLoading) ? <Loading type='bars' color='#333' /> : null }
					</div>
					<span style={styles.paragraph}>Click To Change</span>
				</Dropzone>

				<input id="naem" onChange={this.updateTeam.bind(this)} type="text" placeholder="Team Name" className="form-control" style={localStyle.input} />
				<select style={{border:'1px solid #ddd'}} className="form-control" id="type" onChange={this.updateTeam.bind(this)}>
					<option value="software">Software</option>
					<option value="graphic design">Graphic Design</option>
					<option value="photography">Photography</option>
					<option value="videography">Videography</option>
					<option value="fashion">Fashion</option>
					<option value="social media">Social Media Marketing</option>
					<option value="real estate">Real Estate</option>
					<option value="entertainment">Entertainment</option>
					<option value="legal">Legal</option>
					<option value="personal training">Personal Training</option>
					<option value="other">Other (enter below)</option>
				</select>
				{ (this.state.team.type == 'other') ? <input id="otherCategory" onChange={this.updateTeam.bind(this)} type="text" placeholder="Category" className="form-control" style={localStyle.input} /> : null}
				<br />
				<textarea id="description" placeholder="Team Description" style={localStyle.textarea} onChange={this.updateTeam.bind(this)} value={team.description}></textarea>
				<a href="#" onClick={this.cancel.bind(this)} className="button button-small button-border button-border-thin button-blue">Cancel</a>
				<a href="#" onClick={this.submitTeam.bind(this)} className="button button-small button-border button-border-thin button-blue">Create</a>
			</div>
		)
	}
}

const localStyle = {
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	},
	container: {
		border:'1px solid #ddd',
		marginTop:24,
		padding:24,
		background:'#f9f9f9',
		textAlign:'center'
	},
	teamImage: {
		padding:3,
		border:'1px solid #ddd',
		background:'#fff',
		width: 140,
		marginTop: 12
	},
	btnBlue: {
		className:'button button-small button-border button-border-thin button-blue'
	},
	input: {
		color:'#333',
		background: '#fff',
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%',
		marginTop: 0,
		marginBottom: 16
	},	
	textarea: {
		color:'#333',
		background: '#fff',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 16,
		border: 'none',
		width: 100+'%',
		minHeight: 180
	},
	input: {
		marginTop:16,
		marginBottom: 12,
		color:'#333',
		border: 'none',
		width: 100+'%',
		marginTop: 24
	}
}

export default CreateTeam