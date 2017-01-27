import React, { Component } from 'react'
import { connect } from 'react-redux'
import { APIManager, DateUtils, TextUtils, FirebaseManager } from '../../utils'
import { Sidebar, PostFeed, CreatePost, CreateTeam, TeamFeed, Comment, CreateComment, Notification } from '../view'
import actions from '../../actions/actions'
import styles from './styles'
import { Link } from 'react-router'

class Feed extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Front Page',
			firebaseConnected: false,
			notifications: null,
			menuItems: [
				'Front Page',
				'Saved',
				'Notifications'
			]
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const user = this.props.user
		if (user == null)
			return

		const teamsString = user.teams.join(',')
		const posts = this.props.posts[teamsString]
		if (posts == null)
			this.props.fetchPosts({teams: teamsString, limit:10})
			.then(response => {
				return response
			})
			.catch(err => {

			})
		
		const teams = this.props.teams[user.id] // can be null
		if (teams == null){
			this.props.fetchTeams({'members.id': user.id})
			.then(response => {
				return response
			})
			.catch(err => {

			})
			
			return
		}
	}

	componentDidUpdate(){
		const selected = this.state.selected
		if (selected == 'Saved'){
			const posts = this.props.posts['saved'] // can be bull
			if (posts != null)
				return

			const user = this.props.user
			if (user == null)
				return

			this.props.fetchPosts({saved:user.id})
		}

		if (selected == 'Notifications'){
			console.log('View Notifications')
			const user = this.props.user
			if (user == null)
				return

			if (this.state.firebaseConnected)
				return

			FirebaseManager.register('/'+user.id+'/notifications', (err, notifications) => {
				if (err){
					return
				}

				if (notifications == null)
					return

				console.log('Notification RECEVIED: '+JSON.stringify(notifications))
				this.setState({
					notifications: notifications,
					firebaseConnected: true
				})
			})
		}
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)

		const selected = (item.length == 0) ? event.target.value : item
		this.setState({
			selected: selected
		})
	}

	acceptInvitation(invitation){
		this.props.redeemInvitation(invitation)
		.then((response) => {
			const path = '/'+this.props.user.id+'/notifications/'+invitation.id 
			FirebaseManager.post(path, null, () => {

			})

			if (response.type == null){
				window.location.href = '/feed'
				return
			}

			window.location.href = '/'+response.type+'/'+response.host.slug
		})
		.catch((err) => {
			this.setState({
				error: err
			})
		})
	}

	render(){
		const style = styles.post
		const user = this.props.user
		const selected = this.state.selected
		const teams = this.props.teams[user.id] // can be null

		let content = null
		let posts = null

		if (selected == 'Front Page'){
			const teamsString = user.teams.join(',')
			posts = this.props.posts[teamsString] // can be bull
			content = (posts == null) ? null : <PostFeed posts={posts} deletePost={null} vote={null} user={user} />
		}
		else if (selected == 'Saved'){
			posts = this.props.posts['saved'] // can be bull
			content = (posts == null) ? null : <PostFeed posts={posts} deletePost={null} vote={null} user={user} />
		}
		else if (selected == 'Notifications'){
			const notifications = this.state.notifications
			let list = null
			if (notifications != null)
				list = Object.keys(notifications).map(key => notifications[key])
			
			content = (
				<div>
					{ (list==null) ? null : list.map((notification, i) => {
							return <Notification onAccept={this.acceptInvitation.bind(this)} key={notification.id} {...notification} />
						})
					}
					
				</div>
			)
		}
		else if (selected == 'Teams'){ // mobile UI Only
			content = (
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

					<section id="content" style={style.content}>
						<div className="content-wrap container clearfix">
							<div className="col_two_third">
								<div className="feature-box center media-box fbox-bg" style={{padding:24, textAlign:'left'}}>
									{ content }
								</div>
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
							<select onChange={this.selectItem.bind(this, '')} style={localStyle.select} id="select">
								<option value="Front Page">Front Page</option>
								<option value="Saved">Saved</option>
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
		user: state.account.currentUser,
		posts: state.post,
		teams: state.team,
		profiles: state.profile
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		redeemInvitation: (invitation) => dispatch(actions.redeemInvitation(invitation))
	}
}

export default connect(stateToProps, dispatchToProps)(Feed)
