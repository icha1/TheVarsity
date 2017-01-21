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

		let content = null
		if (selected == 'Application'){
			content = (
				<div>
					<p className="lead" style={localStyle.paragraph} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(application.coverletter)}}></p>
					<hr />
					<h3 style={styles.title}>Projects</h3> 
					{ application.projects.map((project, i) => {
							return (
								<a key={i} target="_blank" href={'/project/'+project.slug}>
									<img style={localStyle.image} src={project.image+'=s120-c'} />
								</a>
							)
						})
					}

					<br /><br />
					<h3 style={styles.title}>Resume</h3>
				</div>
			)
		}

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

				<section id="content" style={{background:'#fff', minHeight:800}}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">

							<div className="feature-box center media-box fbox-bg">
								<div style={styles.main}>
									<a target="_blank" href={'/post/'+application.post.slug} style={localStyle.btnSmall} className={localStyle.btnSmall.className}>View Post</a>
									<h2 style={localStyle.title}>Application: {application.post.title}</h2>
									<hr />

									{ content }
								</div>
							</div>

						</div>

						<div className="col_one_third col_last">

						</div>
					</div>
				</section>

			</div>
		)
	}
}

const localStyle = {
	application: {
		fontWeight:100,
		border:'1px solid #ddd',
		padding:24,
		fontSize:16,
		textAlign: 'left'
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100
	},
	btnBlue: {
		className: 'button button-mini button-border button-border-thin button-blue'
	},
	btnSmall: {
		float: 'right',
		marginTop: 0,
		marginRight: 0,
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
	},
	image: {
		marginTop: 12,
		marginRight: 12,
		background: '#fff',
		padding: 3,
		border: '1px solid #ddd'
	},
	paragraph: {
		textAlign:'left',
		marginTop:24,
		minHeight:300,
		fontSize:16,
		color:'#555',
		marginBottom:12
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

