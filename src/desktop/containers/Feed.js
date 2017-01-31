import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextUtils, FirebaseManager } from '../../utils'
import { PostFeed, Notification, Milestone } from '../view'
import styles from './styles'
import { Link } from 'react-router'
import BaseContainer from './BaseContainer'

class Feed extends Component {
	constructor(){
		super()
		this.state = {

		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const user = this.props.user
		if (user == null)
			return

		if (this.props.teams[user.id] == null)
			this.props.fetchData('team', {'members.id': user.id})

		if (user.teams.length == 0){ // not on any team, fetch project milestones
			const projectsString = user.projects.join(',')
			if (this.props.milestones[projectsString] == null)
				this.props.fetchData('milestone', {'project.id': projectsString, limit:10})

			return
		}

		const teamsString = user.teams.join(',')
		if (this.props.milestones[teamsString] == null)
			this.props.fetchData('milestone', {'teams': teamsString, limit:10})
	}

	componentDidUpdate(){
		const user = this.props.user
//		const selected = this.props.selected
		const selected = this.props.session.pages['feed'].selected
		if (selected == 'Projects'){
			if (user == null)
				return

			if (this.props.projects[user.id] == null)
				this.props.fetchData('project', {'collaborators.id':user.id})
		}
	}

	render(){
		const style = styles.post
		const user = this.props.user
//		const selected = this.props.selected
		const selected = this.props.session.pages['feed'].selected
		const teams = this.props.teams[user.id] // can be null

		let content = null
		let posts = null

		if (selected == 'Recent Activity'){
			const teamOrProjectsString = (user.teams.length == 0) ? user.projects.join(',') : user.teams.join(',')
			const milestones = this.props.milestones[teamOrProjectsString] || []
			content = (
				<div className="postcontent nobottommargin clearfix">
					<div id="posts" className="post-timeline clearfix" style={{textAlign:'left'}}>
						<div className="timeline-border"></div>
						{ milestones.map((milestone, i) => {
								return <Milestone key={milestone.id} withIcon={true} maxWidth={505} {...milestone} />
							})
						}
					</div>
				</div>
			)
		}
		else if (selected == 'Projects'){
			const projects = this.props.projects[user.id] // can be bull
			content = (projects == null) ? null : (
				<div className="feature-box center media-box fbox-bg" style={{padding:24, textAlign:'left'}}>
					<PostFeed posts={projects} deletePost={null} vote={null} user={user} />
				</div>
			)
		}
		else if (selected == 'Notifications'){
			const notifications = this.props.account.notifications
			let list = null
			if (notifications != null)
				list = Object.keys(notifications).map(key => notifications[key])
			
			content = (
				<div className="feature-box center media-box fbox-bg" style={{padding:24, textAlign:'left'}}>
					{ (list==null) ? null : list.map((notification, i) => {
							return <Notification onAccept={this.props.redeem.bind(this)} key={notification.id} {...notification} />
						})
					}
					
				</div>
			)
		}
		else if (selected == 'Teams'){ // mobile UI Only
			content = (
				<div className="feature-box center media-box fbox-bg" style={{padding:24, textAlign:'left'}}>
					<div style={{padding:'0px 24px 0px 24px'}}>
						{ (teams == null) ? null : teams.map((team, i) => {
								return (
									<div key={team.id} style={{padding:'16px 16px 16px 0px'}}>
										<Link to={'/team/'+team.slug}>
											<img style={localStyle.image} src={team.image+'=s44-c'} />
										</Link>
										<Link style={localStyle.detailHeader} to={'/team/'+team.slug}>
											{team.name}
										</Link>
										<br />
										<span style={localStyle.subtext}>{ TextUtils.capitalize(team.type) }</span>
									</div>
								)
							})
						}
					</div>
				</div>
			)
		}

		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9', paddingTop:96}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								{ (user == null) ? null : 
									<div>
										<img style={localStyle.profileImage} src={user.image+'=s140'} />
										<h2 style={ style.title }>
											<Link to={'/profile/'+user.slug}>{ user.username }</Link>
										</h2>
										<span style={styles.paragraph}>{ user.title }</span><br />
										<br />
										<Link to="/account"  href="#" className="button button-mini button-border button-border-thin button-blue" style={{marginLeft:0}}>Account</Link>
									</div>
								}

								<hr />
								<nav>
									<ul style={{listStyleType:'none'}}>
										{ this.props.session.pages['feed'].menu.map((item, i) => {
												const itemStyle = (item == selected) ? localStyle.selected : localStyle.menuItem
												return (
													<li style={{marginTop:0}} key={item}>
														<div style={itemStyle}>
															<a onClick={this.props.onSelectItem.bind(this, item, 'feed')} href="#"><div>{item}</div></a>
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

					<section id="content" style={style.content}>
						<div className="content-wrap container clearfix">
							<div className="col_two_third">
								{ content }
							</div>

							<div className="col_one_third col_last">
								<h2 style={styles.title}>Your Teams</h2>
								<hr />
								<nav id="primary-menu">
									{ (teams == null) ? null : teams.map((team, i) => {
											return (
												<div key={team.id} style={{padding:'16px 16px 16px 0px'}}>
													<Link to={'/team/'+team.slug}>
														<img style={localStyle.image} src={team.image+'=s44-c'} />
													</Link>
													<Link style={localStyle.detailHeader} to={'/team/'+team.slug}>
														{team.name}
													</Link>
													<br />
													<span style={localStyle.subtext}>{ TextUtils.capitalize(team.type) }</span>
												</div>
											)
										})
									}
								</nav>

							</div>
						</div>
					</section>
				</div>

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={localStyle.mobileContainer}>
						<div className="col-xs-6">
							<select onChange={this.props.onSelectItem.bind(this, '')} style={localStyle.select} id="select">
								<option value="Recent Activity">Recent Activity</option>
								<option value="Projects">Projects</option>
								<option value="Teams">Your Teams</option>
							</select>
						</div>

						<div style={{textAlign:'right'}} className="col-xs-6">
							{ (user.image.length == 0) ? null : <img style={{float:'right', borderRadius:24, marginLeft:12}} src={user.image+'=s48-c'} /> }
							<h3 style={localStyle.title}>{ user.username }</h3>
							<span style={styles.paragraph}>{ TextUtils.capitalize(TextUtils.truncateText(user.title, 12)) }</span>
						</div>
					</div>

					<div style={{marginTop:24}}>
						{ content }
					</div>
				</div>
				{ /* end mobile UI */ }

			</div>
		)
	}
}

const localStyle = {
	profileImage: {
		padding:3,
		border:'1px solid #ddd',
		background:'#fff',
		marginTop:6
	},
	image: {
		float:'left',
		marginRight:12,
		borderRadius:22,
		width:44
	},
	detailHeader: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		fontSize: 18,
		lineHeight: 10+'px'
	},
	subtext: {
		fontWeight:100,
		fontSize:14,
		lineHeight:14+'px'
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
	select: {
		color: '#333',
		background: '#fff',
		padding: 6,
		fontWeight: 100,
	    fontSize: 20,
		width: 100+'%',
		marginTop: 6,
		marginLeft: 16,
		fontFamily: 'Pathway Gothic One',
		border: 'none'
	},
	mobileContainer: {
		background:'#f9f9f9',
		padding:12,
		borderBottom:'1px solid #ddd',
		lineHeight:10+'px'
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	}
}

const stateToProps = (state) => {
	return {
		account: state.account,
		page: state.session.pages.feed,
		posts: state.post,
		projects: state.project,
		milestones: state.milestone,
		teams: state.team,
		profiles: state.profile
	}
}

const dispatchToProps = (dispatch) => {
	return {

	}
}

export default connect(stateToProps, dispatchToProps)(BaseContainer(Feed, 'feed'))
