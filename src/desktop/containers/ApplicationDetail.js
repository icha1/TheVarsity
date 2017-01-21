import React, { Component } from 'react'
import { connect } from 'react-redux'
import { APIManager, DateUtils, TextUtils } from '../../utils'
import { Sidebar, PostFeed, CreatePost, CreateTeam, TeamFeed, Comment, CreateComment } from '../view'
import actions from '../../actions/actions'
import styles from './styles'
import { Link } from 'react-router'


class ApplicationDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Application',
			menuItems: ['Application', 'Chat']
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const application = this.props.application[this.props.slug]
		if (application == null){
			this.props.fetchApplications({slug: this.props.slug})
			.then(response => {

			})
			.catch(err => {

			})
			return
		}

		const applicant = this.props.profiles[application.from.slug]
		if (applicant == null)
			this.props.fetchProfiles({slug: application.from.slug})
	}

	componentDidUpdate(){

	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)

		const selected = (item.length == 0) ? event.target.value : item
		this.setState({
			selected: selected
		})
	}

	render(){
		const style = styles.post
		const application = this.props.application[this.props.slug]
		const applicant = this.props.profiles[application.from.slug]
		const selected = this.state.selected

		return (
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9', paddingTop:96}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								{ (applicant == null) ? null : 
									<div>
										<img style={localStyle.profileImage} src={applicant.image+'=s140'} />
										<h2 style={ style.title }>
											<Link to={'/profile/'+applicant.slug}>{ applicant.username }</Link>
										</h2>
										<span style={styles.paragraph}>{ applicant.title }</span><br />
										<br />
										<Link to={'/profile/'+applicant.slug}  href="#" className={localStyle.btnBlue.className} style={{marginLeft:0}}>View Profile</Link>
									</div>
								}

								<hr />
								<nav>
									<ul style={{listStyleType:'none'}}>
										{ this.state.menuItems.map((item, i) => {
												const itemStyle = (item == selected) ? localStyle.selected : localStyle.menuItem
												return (
													<li style={{marginTop:0}} key={item}>
														<div style={itemStyle}>
															<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
														</div>
													</li>
												)
											})
										}
									</ul>
								</nav>
				            </div>

			            </div>
					</header>

				</div>
		)
	}
}

const localStyle = {
	btnBlue: {
		className: 'button button-mini button-border button-border-thin button-blue'
	},
	profileImage: {
		padding:3,
		border:'1px solid #ddd',
		background:'#fff',
		marginTop:6
	},
	selected: {
		padding: '6px 6px 6px 16px',
		background: '#fff',
		borderRadius: 2,
		borderLeft: '3px solid rgb(91, 192, 222)',
		fontSize: 16,
		fontWeight: 400
	},
	menuItem: {
		padding: '6px 6px 6px 16px',
		background: '#f9f9f9',
		borderLeft: '3px solid #ddd',
		fontSize: 16,
		fontWeight: 100
	}
}

const stateToProps = (state) => {
	return {
		application: state.application,
		user: state.account.currentUser,
		teams: state.team,
		profiles: state.profile
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchApplications: (params) => dispatch(actions.fetchApplications(params)), 
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params))
	}
}

export default connect(stateToProps, dispatchToProps)(ApplicationDetail)

