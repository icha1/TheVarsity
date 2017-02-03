import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../../actions/actions'
import { FirebaseManager, TextUtils } from '../../utils'
import { PostFeed, TeamFeed, Teams } from '../view'
import styles from './styles'
import BaseContainer from './BaseContainer'

class ProfileDetail extends Component {
	constructor(){
		super()
		this.state = {
			showEdit: false
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)

		const profile = this.props.profiles[this.props.slug]
		if (profile == null){
			this.props.fetchData('profile', {slug: this.props.slug}, true)
			.then(response => {
				const p = this.props.profiles[this.props.slug]
				if (this.props.teams[p.id] == null)
					this.props.fetchData('team', {'members.id': p.id})

				return response
			})
			.catch(err => {
				console.log('ERROR '+err)
			})
			return
		}

		document.title = 'The Varsity | '+profile.username
		if (this.props.teams[profile.id])
			return

		this.props.fetchData('team', {'members.id': profile.id})
	}

	componentDidUpdate(){
		const profile = this.props.profiles[this.props.slug]
		if (profile == null)
			return

		const selected = this.props.session.pages['profile'].selected
		if (selected == 'Projects'){
			if (this.props.projects[profile.id] == null)
				this.props.fetchData('project', {'collaborators.id': profile.id})
		}
	}


	render(){
		const style = styles.post
		const profile = this.props.profiles[this.props.slug] // can be null

		const selected = this.props.session.pages['profile'].selected

		let username = null
		let image = null
		if (profile != null){
			username = profile.username
			image = (profile.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd'}} src={profile.image+'=s140-c'} />
		}

		let content = null
		const currentUser = this.props.user // can be null
		
		if (selected == 'Profile' && profile != null){
			let location = ''
			if (profile != null){
				if (profile.location.city != null)
					location = TextUtils.capitalize(profile.location.city)

				if (profile.location.state != null)
					location += (location.length == 0) ? profile.location.state.toUpperCase() : ', '+profile.location.state.toUpperCase()
				
			}

			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					<div className="hidden-xs">
						<h4 style={styles.header}>{ profile.title }</h4>
						<h4 style={styles.header}>{ location }</h4>
						<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(profile.bio)}}></p>
					</div>

					{ /* mobile UI*/ }
					<div className="visible-xs" style={{padding:'0px 24px 0px 24px'}}>
						{ (profile.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginBottom:12}} src={profile.image+'=s160-c'} /> }
						<h4 style={styles.header}>{ profile.title }</h4>
						<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(profile.bio)}}></p>
					</div>
				</div>
			)
		}

		else if (selected == 'Projects' && profile != null){
			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					<div className="hidden-xs">
						<PostFeed posts={this.props.projects[profile.id]} user={currentUser} />
					</div>

					{ /* mobile UI*/ }
					<div className="visible-xs" style={{padding:0}}>
						<PostFeed posts={this.props.projects[profile.id]} user={currentUser} />
					</div>
				</div>
			)
		}
		
		else if (selected == 'Teams' && profile != null){
			let teams = (this.props.teams[profile.id]) ? <TeamFeed teams={this.props.teams[profile.id]} user={currentUser} /> : null
			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					<div className="hidden-xs">
						{teams}
					</div>

					{ /* mobile UI*/ }
					<div className="visible-xs" style={{padding:0}}>
						{teams}
					</div>
				</div>
			)
		}
		
		const teams = (profile) ? this.props.teams[profile.id] : []

		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9', paddingTop:96}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								{ (profile == null) ? null : 
									<div>
										<img style={localStyle.profileImage} src={profile.image+'=s140-c'} />
										<h2 style={ styles.team.title }>
											<Link to={'/profile/'+profile.slug}>{ profile.username }</Link>
										</h2>
										<span style={styles.paragraph}>{ profile.title }</span><br />
										<span style={styles.paragraph}>{ profile.location.city }</span><br />
									</div>
								}

								<hr />
								<nav>
									<ul style={{listStyleType:'none'}}>
										{ this.props.session.pages['profile'].menu.map((item, i) => {
												const itemStyle = (item == selected) ? localStyle.selected : localStyle.menuItem
												return (
													<li style={{marginTop:0}} key={item}>
														<div style={itemStyle}>
															<a onClick={this.props.onSelectItem.bind(this, item, 'profile')} href="#"><div>{item}</div></a>
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
										<h2 style={styles.team.title}>{selected}</h2>
										<hr />
										{ content }
									</div>
								</div>

							</div>

							<div className="col_one_third col_last">
								<Teams teams={teams} />
							</div>

						</div>
					</section>
				</div>

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<select onChange={this.props.onSelectItem.bind(this, '', 'profile')} style={localStyle.select} id="select">
								<option value="Profile">Profile</option>
								<option value="Projects">Projects</option>
								<option value="Teams">Teams</option>
								<option value="Direct Message">Direct Message</option>
							</select>
						</div>

						{ (profile == null) ? null : 
							<div style={{textAlign:'right'}} className="col-xs-6">
								{ (profile.image.length == 0) ? null : <img style={{float:'right', borderRadius:24, marginLeft:12}} src={profile.image+'=s48-c'} /> }
								<h3 style={style.title}>{ profile.username }</h3>
								<span style={styles.paragraph}>{ TextUtils.capitalize(profile.location.city) }</span>
							</div>
						}
					</div>

					{ content }
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
		profiles: state.profile,
		posts: state.post,
		projects: state.project,
		teams: state.team
	}
}

const dispatchToProps = (dispatch) => {
	return {

	}
}

export default connect(stateToProps, dispatchToProps)(BaseContainer(ProfileDetail, 'profile'))
