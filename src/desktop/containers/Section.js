import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Redeem } from '../view'
import { APIManager, TextUtils, Alert } from '../../utils'
import { browserHistory, Link } from 'react-router'

class Section extends Component {

	constructor(){
		super()
		this.state = {
			error: null,
			credentials: {
				email: '',
				name: ''
			}
		}
	}

	redeemInvitation(invitation){
		console.log('REDEEM: '+JSON.stringify(invitation))
		delete invitation['name'] // this messes up the search for invitation
		this.props.redeemInvitation(invitation)
		.then((response) => {
			// if (invitation.context == null){
			// 	window.location.href = '/feed'
			// 	return
			// }

			// window.location.href = '/'+invitation.context.type+'/'+invitation.context.slug

			if (response.type == null){
				window.location.href = '/feed'
				return
			}

			window.location.href = '/'+response.type+'/'+response.host.slug

		})
		.catch((err) => {
//			console.log('ERROR -- ' + err)
			this.setState({
				error: err
			})
		})
	}

	requestInvite(invitation){
		const team = this.props.team
		if (team){
			invitation['team'] = {
				image: team.image,
				name: team.name,
				id: team.id
			}
		}

		return this.props.requestInvitation(invitation)
	}

	updateCredentials(event){
		var updatedCredentials = Object.assign({}, this.state.credentials)
		updatedCredentials[event.target.id] = event.target.value

		this.setState({
			credentials: updatedCredentials
		})
	}

	register(event){
		if (event)
			event.preventDefault()

		const credentials = this.state.credentials
		// validate fields
		if (credentials.name.length == 0){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please enter your full name'
			})
			return
		}		
		if (credentials.email.length == 0){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please enter your email'
			})
			return
		}
		if (TextUtils.validateEmail(credentials.email) == false){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please enter a valid email'
			})
			return
		}

		this.sendCredentials('/account/register')
	}

	sendCredentials(endpoint){
		let credentials = Object.assign({}, this.state.credentials)
		credentials['username'] = credentials.name.replace(' ', '_')

		APIManager
		.handlePost(endpoint, credentials)
		.then(result => {
//			console.log('RESULT: '+JSON.stringify(result))
			this.props.currentUserReceived(result.user)
			browserHistory.push('/account')
		})
		.catch((err) => {
			alert(err.message)
		})
	}

	render(){
		let content = null

		if (this.props.content == 'header'){
			content = (
			    <section className="page-section section parallax dark" style={{background: 'url("/images/office-3.jpg") center', overflow:'visible', margin:0, paddingTop:0, minHeight:425}} data-height-lg="425" data-height-md="425" data-height-sm="450" data-height-xs="450" data-height-xxs="450">
			        <div className="vertical-middle">
			            <div className="heading-block center nobottomborder" style={{paddingTop:48}}>
			                <h1 style={localStyle.titleWhite} data-animate="fadeInUp">The Varsity</h1>
			                <span style={{fontWeight:100}} data-animate="fadeInUp" data-delay="300">
			                	Build Your Next Project and<br />
			                	Find Your Team on The Varsity<br />
			                </span>
			                <br /><br />
			                <div data-animate="fadeIn" data-delay="800">
								<div className="col_one_third"></div>
								<div className="col_one_third col_last" style={{padding:24}}>
									<Redeem
										layout="center" 
										type="redeem"
										error={this.state.error}
										submitInvite={this.redeemInvitation.bind(this)} />
								</div>
			                </div>
			            </div>
			        </div>
			    </section>
			)
		}
		else if (this.props.content == 'about'){
			content = (
				<section id="section-about" style={{background:'#fff', paddingTop:32}} className="page-section">
					<div className="content-wrap container clearfix">
		                <h2 style={localStyle.title}>What Is The Varsity</h2>
						<div className="col_two_third" style={localStyle.paragraph}>
							The Varsity is a collection of online groups focused on building projects. Software engineers, 
							graphic designers, photographers, copywriters, web developers and more come together to 
							work on projects and find like-minded people.
							<br /><br />
							The Varsity is not a spectator sport - it is a platforms for helping fellow creators push 
							their ideas forward. If you have a project or are looking for interesting concepts to work 
							on, The Varsity is for you.
						</div>

						<div className="col_one_third col_last" style={{textAlign:'right'}}>
							<img style={localStyle.image} src="/images/girls.jpg" />
						</div>
					</div>
				</section>
			)
		}
		else if (this.props.content == 'advantage') {
			content = (
				<section id="section-about" style={{background:'#fff', paddingTop:32, borderTop:'1px solid #ddd'}} className="page-section">
					<div className="content-wrap container clearfix">
						<div className="col_half" style={localStyle.paragraph}>
							<img src="/images/projects.jpg" />
						</div>

						<div className="col_half col_last" style={localStyle.paragraph}>
		                	<h2 style={localStyle.title}>Grow Your Project</h2>
		                	Every project requires a wide variety of skills and talents. On The Varsity, there is a team 
		                	for that. Need a new logo for your business? Check with the Graphic Design Team. Looking 
		                	for help setting up website with mobile responsiveness? Try the <Link style={{color:'red'}} to="/team/hack-exchange-iar038vl">Hack Exchange</Link> software team.

		                	<br /><br />

		                	<h2 style={localStyle.title}>Better Collaboration</h2>
		                	Find the perfect collaborators for your project or join a project that could benefit from 
		                	your expertise. The Varsity matches people with different skills to create the right fit.
						</div>
					</div>
				</section>
			)
		}
		else if (this.props.content == 'redeem'){
			content = (
				<section style={localStyle.container}>
					<div className="content-wrap container clearfix">
		                <h2 style={localStyle.title}>Join The Varsity</h2>
						<div className="col_half" style={localStyle.paragraph}>
							Did you receive an invitation to a team on The Varsity? Submit your email and invite 
							code to accept the invitation and get started on the platform.
						</div>

						<div className="col_half col_last">
							<input onChange={this.updateCredentials.bind(this)} id="name" style={localStyle.input} type="text" placeholder="Name" />
							<input onChange={this.updateCredentials.bind(this)} id="email" style={localStyle.input} type="text" placeholder="Email" />
				            <div style={{textAlign:'right'}}>
					            <a href="#" onClick={this.register.bind(this)} className="button button-circle" style={localStyle.btnBlue}>Join</a>
				            </div>
						</div>
					</div>
				</section>
			)
		}
		else if (this.props.content == 'request'){
			content = (
				<section id="request" style={localStyle.container}>
					<div className="content-wrap container clearfix">
		                <h2 style={localStyle.title}>Request Invitation</h2>
						<div className="col_half" style={localStyle.paragraph}>
							The Varsity is currently under beta testing in preparation for a February 2017 release. 
							Join our beta and receive free, unlimited premium access when we launch.
							<br /><br />
							Premium members can collect fees on any group they create when hiring 
							companies post opportunities to the bulletin board.
						</div>

						<div className="col_half col_last">
							<Redeem type={this.props.content} error={this.state.error} requestInvite={this.requestInvite.bind(this)} />
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
		fontWeight: 100,
		marginBottom: 4
	},
	titleWhite: {
		color:'#fff',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100
	},
	image: {
		background: '#fff',
		padding: 3,
		border:'1px solid #ddd'
	},
	paragraph: {
		fontWeight: 100,
		fontSize: 18
	},
	paragraphWhite: {
		fontWeight: 100,
		fontSize: 18,
		color:'#fff'
	},
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

const stateToProps = (state) => {
	return {
		teams: state.team
	}
}

const dispatchToProps = (dispatch) => {
	return {
		currentUserReceived: (user) => dispatch(actions.currentUserReceived(user)),
		requestInvitation: (invitation) => dispatch(actions.requestInvitation(invitation)),
		redeemInvitation: (invitation) => dispatch(actions.redeemInvitation(invitation))
	}

}

export default connect(stateToProps, dispatchToProps)(Section)