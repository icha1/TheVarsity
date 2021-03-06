import React, { Component } from 'react'
import { TextUtils, APIManager, Alert } from '../../utils'
import styles from './styles'

class TeamInfo extends Component {
	constructor(){
		super()
		this.state = {
			isEditing: false,
			invitation: {
				name: '',
				email: ''
			},
			updated: {}
		}
	}

	componentDidMount(){
		let updated = Object.assign({}, this.state.updated)
		updated['description'] = this.props.team.description
		this.setState({
			updated: updated
		})
	}

	uploadImage(source, files){
		APIManager.upload(files[0], (err, image) => {
			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.updated)
			updated['image'] = image.address
			this.setState({
				updated: updated
			})
		})
	}

	updateInvitation(event){
		let updated = Object.assign({}, this.state.invitation)
		updated[event.target.id] = event.target.value
		this.setState({
			invitation: updated
		})
	}

	submitInvitation(event){
		event.preventDefault()
		if (this.state.invitation.name.length == 0){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please enter your name'
			})
			return
		}

		if (this.state.invitation.email.length == 0){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please enter your email'
			})
			return
		}

		this.props.onSubmitInvitation(this.state.invitation)
		.then(response => {
//			console.log(JSON.stringify(response))
			Alert.showConfirmation({
				title: 'Request Sent!',
				text: 'Thanks for your interest in The Varsity. Someone from '+response.result.team.name+' will reach out to you soon.'
			})

			this.setState({
				invitation: {
					name: '',
					email: ''
				}
			})
		})
		.catch(err => {
			Alert.showAlert({
				title: 'Error',
				text: err.message || err
			})
		})
	}

	updateDescription(event){
		let updated = Object.assign({}, this.state.updated)
		updated['description'] = event.target.value
		this.setState({
			updated: updated
		})
	}

	updateTeam(event){
		event.preventDefault()
		this.props.onUpdate(this.state.updated)
		.then(response => {
			this.setState({
				isEditing: false
			})
		})
		.catch(err => {
			alert(err.message)
		})
	}

	toggleEdit(event){
		event.preventDefault()
		this.setState({
			isEditing: !this.state.isEditing
		})
	}

	memberFound(profile, list){
		if (profile == null)
			return false

		let isFound = false
		list.every((member, i) => {
			if (member.id == profile.id){
				isFound = true
				return false
			}

			return true
		})

		return isFound
	}


	render(){
		const team = this.props.team
		const isAdmin = this.memberFound(this.props.user, team.admins)

		return (
			<div style={localStyle.container}>
				{ (team.image.length == 0) ? null : <img style={localStyle.teamImage} src={team.image+'=s140-c'} /> }
				<h3 style={localStyle.title}>{team.name}</h3>
				<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span>
				<br /><br />
				<input id="name" value={this.state.invitation.name} onChange={this.updateInvitation.bind(this)} placeholder="Name" style={localStyle.input} type="text" />
				<input id="email" value={this.state.invitation.email} onChange={this.updateInvitation.bind(this)} placeholder="Email" style={localStyle.input} type="text" />
				<a href="#" onClick={this.submitInvitation.bind(this)} className={localStyle.btnBlue.className} style={{marginLeft:0}}>Request Invitation</a>

				<hr />
				{ (isAdmin) ? <a onClick={this.toggleEdit.bind(this)} href="#">{ (this.state.isEditing) ? 'Cancel' : 'Edit'} </a> : null }
				{ (this.state.isEditing) ? 
					<div>
						<textarea style={localStyle.textarea} onChange={this.updateDescription.bind(this)} value={this.state.updated.description}></textarea>
						<a href="#" onClick={this.updateTeam.bind(this)} className={localStyle.btnBlue.className} style={{marginLeft:0}}>Update</a>
					</div>
					:
					<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
				}
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
		background:'#fff'
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
		marginTop: 12,
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 16,
		border: 'none',
		width: 100+'%',
		fontFamily:'Pathway Gothic One',
		minHeight: 180
	}	
}

export default TeamInfo