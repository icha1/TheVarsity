import React, { Component } from 'react'
import { TextUtils } from '../../utils'
import styles from './styles'

class TeamInfo extends Component {
	constructor(){
		super()
		this.state = {
			invitation: {
				name: '',
				email: ''
			}

		}
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
			alert('Please enter your name')
			return
		}

		if (this.state.invitation.email.length == 0){
			alert('Please enter your email')
			return
		}

		this.props.onSubmitInvitation(this.state.invitation)
	}

	render(){
		const team = this.props.team

		return (
			<div style={localStyle.container}>
				{ (team.image.length == 0) ? null : <img style={localStyle.teamImage} src={team.image+'=s140-c'} /> }
				<h3 style={styles.title}>{team.name}</h3>
				<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span>
				<hr />
				<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
				<input id="name" onChange={this.updateInvitation.bind(this)} placeholder="Name" style={localStyle.input} type="text" />
				<input id="email" onChange={this.updateInvitation.bind(this)} placeholder="Email" style={localStyle.input} type="text" />
				<a href="#" onClick={this.submitInvitation.bind(this)} className="button button-small button-border button-border-thin button-blue" style={{marginLeft:0}}>Request Invitation</a>
			</div>


		)
	}
}

const localStyle = {
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
		backgroundColor:'rgb(91, 192, 222)'
	},
	error: {
		color: 'red'
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
}

export default TeamInfo