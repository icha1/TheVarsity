import React, { Component } from 'react'
import { APIManager } from '../../utils'

class Redeem extends Component {
	constructor(){
		super()
		this.getParameter = this.getParameter.bind(this)
		this.state = {
			showInviteCodeLabel: false,
			invitation: {
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
		if (this.state.invitation.email.length == 0){
			alert('Please enter your email.')
			return
		}

		if (this.state.invitation.code.length == 0){
			alert('Please enter the invite code.')
			return
		}

		if (this.props.submitInvite != null)
			this.props.submitInvite(this.state.invitation)
	}

	render(){
		const layout = (this.props.layout == null) ? 'right' : this.props.layout

		return (
			<div>
		        { (this.props.error) ? <div><span style={localStyle.error}>{ ''+this.props.error }</span><br /></div> : null }
				<input id="email" value={this.state.invitation.email} onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Email" />
				{ (this.state.showInviteCodeLabel) ? <label style={{fontWeight:100}}>Invite Code</label> : null }
				<input id="code" value={this.state.invitation.code} onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Invite Code" />
	            <div style={{textAlign:layout}}>
		            <a href="#" onClick={this.redeemInvitation.bind(this)} className="button button-circle" style={localStyle.btnBlue}>Accept Invitation</a>
	            </div>
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