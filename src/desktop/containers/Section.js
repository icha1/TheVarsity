import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Redeem } from '../view'
import { browserHistory } from 'react-router'

class Section extends Component {

	constructor(){
		super()
		this.state = {
			error: null,
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

	redeemInvitation(invitation){
		this.props.redeemInvitation(invitation)
		.then((response) => {
//			console.log('REDEEM: '+JSON.stringify(response)) // returns 'team' and 'user'
			window.location.href = '/account' // this is just easier for now
		})
		.catch((err) => {
			console.log('ERROR -- ' + err)
			this.setState({
				error: err
			})
		})
	}

	render(){
		return (
			<section style={localStyle.container}>
				<div className="content-wrap container clearfix">
	                <h2 style={localStyle.title}>Redeem Invite Code</h2>
					<div className="col_half" style={localStyle.paragraph}>
						We are currently beta testing The Varsity in preparation for a January 2017 release. 
						Join our beta and receive free, unlimited premium access when we launch.
						<br /><br />
						Premium members can collect fees on any group they create when hiring companies post 
						opportunities to the bulletin board.
					</div>

					<div className="col_half col_last" style={{textAlign:'right'}}>
						<Redeem error={this.state.error} submitInvite={this.redeemInvitation.bind(this)} />
					</div>
				</div>
			</section>

		)
	}
}

const localStyle = {
	container: {
		background:'#fff',
		borderTop:'1px solid #ddd',
		paddingTop:32
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100
	},
	paragraph: {
		fontWeight: 100,
		fontSize: 18
	},
	btnBlue: {
		backgroundColor:'rgb(91, 192, 222)'
	},
	error: {
		color: 'red'
	}
}

const stateToProps = (state) => {
	return {

	}
}

const dispatchToProps = (dispatch) => {
	return {
		redeemInvitation: (invitation) => dispatch(actions.redeemInvitation(invitation))
	}

}

export default connect(stateToProps, dispatchToProps)(Section)