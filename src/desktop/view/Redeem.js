import React, { Component } from 'react'

class Redeem extends Component {
	constructor(){
		super()
		this.state = {
			invitation: {
				email: '',
				code: ''
			}
		}
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

		if (this.props.submitInvite != null)
			this.props.submitInvite(this.state.invitation)
	}

	render(){
		return (
			<div style={{textAlign:'right'}}>
				<input id="email" onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Email" />
				<input id="code" onChange={this.updateInvitation.bind(this)} style={localStyle.input} type="text" placeholder="Invite Code" />
	            <a href="#" onClick={this.redeemInvitation.bind(this)} className="button button-circle" style={localStyle.btnBlue}>Submit</a>
	            <br />
	            { (this.props.error) ? <span style={localStyle.error}>Error: Invitation Not Found. Check Email or Invite Code.</span> : null }

			</div>
		)
	}
}

const localStyle = {
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
	btnBlue: {
		backgroundColor:'rgb(91, 192, 222)'
	},
	error: {
		color: 'red'
	}
}

export default Redeem