import React, { Component } from 'react'
import { APIManager, Alert } from '../../utils'

class Redeem extends Component {
	constructor(){
		super()
		this.getParameter = this.getParameter.bind(this)
		this.state = {
			showInviteCodeLabel: false,
			invitation: {
				name: '',
				email: '',
				code: ''
			}
		}
	}

	componentDidMount(){
		const inviteId = this.getParameter('invite')
		if (inviteId == null)
			return

		APIManager.handleGet('/api/invitation/'+inviteId, null)
		.then(response => {
			console.log(JSON.stringify(response))
			const result = response.result

			let updated = Object.assign({}, this.state.invitation)
			updated['code'] = result.code
			updated['email'] = result.email
			this.setState({
				showInviteCodeLabel: true,
				invitation: updated
			})
		})
		.catch(err => {

		})
	}

	getParameter(name, url) {
	    if (!url) {
	      url = window.location.href
	    }

	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	updateInvitation(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.invitation)
		updated[event.target.id] = event.target.value
		this.setState({
			invitation: updated
		})
	}

	redeemInvitation(event){
		event.preventDefault()
		
		if (this.props.mode == 'redeem'){
			if (this.state.invitation.code.length == 0){
				Alert.showAlert({
					title: 'Oops',
					text: 'Please enter the invite code.'
				})
				return
			}
		}
		else {
			if (this.state.invitation.name.length == 0){
				Alert.showAlert({
					title: 'Oops',
					text: 'Please enter your name.'
				})
				return
			}			
		}

		if (this.state.invitation.email.length == 0){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please enter your email.'
			})
			return
		}

		if (this.props.mode == 'redeem'){
			if (this.props.submitInvite != null)
				this.props.submitInvite(this.state.invitation)

			return
		}

		if (this.props.requestInvite == null)
			return

		this.props.requestInvite(this.state.invitation)
		.then(response => {
//			console.log(JSON.stringify(response))
			this.setState({
				invitation: {
					name: '',
					email: '',
					code: ''
				}				
			})
			
			Alert.showConfirmation({
				title: 'Request Sent!',
				text: 'Thanks for your interest in The Varsity. We will reach out to you soon.'
			})
		})
		.catch(err => {
			Alert.showAlert({
				title: 'Error',
				text: err.message || err
			})
		})
	}

	render(){
		const layout = (this.props.layout == null) ? 'right' : this.props.layout
		const mode = (this.props.mode) ? this.props.mode : 'redeem' // redeem or request

		return (
			<div>
				{ (mode == 'redeem') ? 
					<div>
				        { (this.props.error) ? <div><span style={localStyle.error}>{ ''+this.props.error }</span><br /></div> : null }
						<input id="email" value={this.state.invitation.email} onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Email" />
						{ (this.state.showInviteCodeLabel) ? <label style={{fontWeight:100}}>Invite Code</label> : null }
						<input id="code" value={this.state.invitation.code} onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Invite Code" />
			            <div style={{textAlign:layout}}>
				            <a href="#" onClick={this.redeemInvitation.bind(this)} className="button button-circle" style={localStyle.btnBlue}>Accept Invitation</a>
			            </div>
					</div>
					: 
					<div>
				        { (this.props.error) ? <div><span style={localStyle.error}>{ ''+this.props.error }</span><br /></div> : null }
						<input id="name" value={this.state.invitation.name} onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Name" />
						<input id="email" value={this.state.invitation.email} onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Email" />
			            <div style={{textAlign:layout}}>
				            <a href="#" onClick={this.redeemInvitation.bind(this)} className="button button-circle" style={localStyle.btnBlue}>Reqeust Invitation</a>
			            </div>
					</div>
				}
			</div>

		)
	}
}

const localStyle = {
	btnBlue: {
		backgroundColor:'rgb(91, 192, 222)'
	},
	error: {
		color: 'red'
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
	}
}

export default Redeem