import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Redeem } from '../view'
import { browserHistory } from 'react-router'

class Section extends Component {

	constructor(){
		super()
		this.state = {
			error: null
		}
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
		let content = null
		if (this.props.content == 'header'){
			content = (
			    <section className="page-section section parallax dark" style={{background: 'url("/images/office-3.jpg") center', overflow:'visible', margin:0}} data-height-lg="425" data-height-md="425" data-height-sm="450" data-height-xs="450" data-height-xxs="450">
			        <div className="vertical-middle">
			            <div className="heading-block center nobottomborder" style={{paddingTop:48}}>
			                <h1 style={localStyle.titleWhite} data-animate="fadeInUp">The Varsity</h1>
			                <span style={{fontWeight:100}} data-animate="fadeInUp" data-delay="300">
			                	Find Your Next Job or Hire <br />Through The Varsity in 2017
			                </span>
			                <br /><br />
			                <div data-animate="fadeIn" data-delay="800">
								<div className="col_one_third"></div>
								<div className="col_one_third col_last" style={{padding:24}}>
									<Redeem
										layout="center" 
										error={this.state.error}
										submitInvite={this.redeemInvitation.bind(this)} />
								</div>
			                </div>
			            </div>
			        </div>
			    </section>
			)
		}
		else {
			content = (
				<section style={localStyle.container}>
					<div className="content-wrap container clearfix">
		                <h2 style={localStyle.title}>Accept Invitation</h2>
						<div className="col_half" style={localStyle.paragraph}>
							Did you receive an invitation to a team on The Varsity? Submit your email and invite 
							code to accept the invitation and get started on the platform.
						</div>

						<div className="col_half col_last">
							<Redeem error={this.state.error} submitInvite={this.redeemInvitation.bind(this)} />
						</div>
					</div>
				</section>
			)
		}

		return (
			<div>
				{content}
			</div>
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
	titleWhite: {
		color:'#fff',
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