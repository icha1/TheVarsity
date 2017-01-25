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
		console.log('REDEEM INVITATION: '+JSON.stringify(invitation))
		this.props.redeemInvitation(invitation)
		.then((response) => {
			window.location.href = '/feed' // relocate to feed page
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
							The Varsity is a collection of online communities organized into groups by skill: designers, 
							photographers, software engineers, real estate etc. Groups are curated by members 
							and maintained through an invite-only system.
							<br /><br />
							Users can tap into these groups when seeking referrals or hiring for their company. Find your next job or employee through the Varsity in 2017.
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
			    <section style={{background:'#2e3842', borderTop:'1px solid #ddd'}} className="page-section notopmargin nobottommargin section">
			        <div className="container clearfix">
					    <h2 style={localStyle.titleWhite}>The Varsity Advantage</h2>

			            <div className="col_one_third">
			                <div className="heading-block fancy-title nobottomborder title-bottom-border">
			                    <h4 style={localStyle.titleWhite}>Better Opportunities</h4>
			                </div>
			                <img style={localStyle.image} src="/images/satellite-2.png" />
			                <p style={localStyle.paragraphWhite}>
								Every group has a bulletin board where professional opportunities are posted. Hiring companies 
								can better target specific skillsets by posting in the right groups.
			                </p>
			            </div>

			            <div className="col_one_third">
			                <div className="heading-block fancy-title nobottomborder title-bottom-border">
			                    <h4 style={localStyle.titleWhite}>Stronger Connections</h4>
			                </div>
			                <img style={localStyle.image} src="/images/kithen.jpg" />
			                <p style={localStyle.paragraphWhite}>
								Groups are maintained by members through invite-only. No more spam from salesman, recruiters, 
								and such. The Varsity cuts out the noise.                
			                </p>
			            </div>

			            <div className="col_one_third col_last">
			                <div className="heading-block fancy-title nobottomborder title-bottom-border">
			                    <h4 style={localStyle.titleWhite}>More Revenue</h4>
			                </div>
			                <img style={localStyle.image} src="/images/meetup.jpg" />
			                <p style={localStyle.paragraphWhite}>
								Group admins can charge fees for posting to the bulletin board. Fees go directly to the group 
								moderator.
								<br />
								* This is a premium feature.
			                </p>
			            </div>

			        </div>
			    </section>
			)
		}
		else if (this.props.content == 'redeem'){
			content = (
				<section style={localStyle.container}>
					<div className="content-wrap container clearfix">
		                <h2 style={localStyle.title}>Accept Invitation</h2>
						<div className="col_half" style={localStyle.paragraph}>
							Did you receive an invitation to a team on The Varsity? Submit your email and invite 
							code to accept the invitation and get started on the platform.
						</div>

						<div className="col_half col_last">
							<Redeem type="redeem" error={this.state.error} submitInvite={this.redeemInvitation.bind(this)} />
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
		fontWeight: 100
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
	}
}

const stateToProps = (state) => {
	return {
		teams: state.team
	}
}

const dispatchToProps = (dispatch) => {
	return {
		requestInvitation: (invitation) => dispatch(actions.requestInvitation(invitation)),
		redeemInvitation: (invitation) => dispatch(actions.redeemInvitation(invitation))
	}

}

export default connect(stateToProps, dispatchToProps)(Section)