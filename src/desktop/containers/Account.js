import React, { Component } from 'react'
import styles from './styles'
import { EditProfile, TeamFeed, CreateTeam, PostFeed, Map } from '../view'
import { connect } from 'react-redux'
import { TextUtils } from '../../utils'
import actions from '../../actions/actions'

class Account extends Component {
	constructor(){
		super()
		this.state = {
			showEdit: false,
			showMap: false,
			selected: 'Teams',
			menuItems: [
				'Teams',
//				'Profile',
				'Messages'
			]
		}
	}

	componentDidMount(){
		const user = this.props.user
		if (user == null)
			return

		if (this.props.teams[user.id])
			return

		this.props.fetchTeams({'members.id': user.id}) // fetch teams if necessary
	}

	selectItem(item, event){
		event.preventDefault()

		// const item = this.state.menuItems
		this.setState({
			selected: item,
			showEdit: false
		})
	}

	editProfile(event){
		if (event)
			event.preventDefault()

		this.setState({
			showEdit: !this.state.showEdit
		})
	}

	updateProfile(updated){
		if (this.props.user == null)
			return

		this.props.updateProfile(this.props.user, updated)
		this.setState({
			showEdit: !this.state.showEdit
		})
	}

	toggleMap(event){
		event.preventDefault()
		this.setState({
			showMap: !this.state.showMap
		})
	}

	unsavePost(post){
		const user = this.props.user
		if (user == null){
			alert('Please register or log in.')
			return
		}

		if (post.saved.indexOf(user.id) == -1)
			return		

		this.props.unsavePost(post, user)
	}

	createTeam(team){
		if (this.props.user == null){
			alert('Please log in or register to create a team.')
			return
		}

		const membersList = [{id: this.props.user.id, username: this.props.user.username, image: this.props.user.image}]
		team['members'] = membersList
		team['admins'] = membersList
		this.props.createTeam(team)
		.then((response) => {
//			console.log('TEAM CREATED: '+JSON.stringify(response))
			const result = response.result
			window.location.href = '/team/'+result.slug
			return
		})
		.catch(err => {
			alert(err)
		})
	}

	componentDidUpdate(){
		const user = this.props.user
		if (user == null)
			return

		const selected = this.state.selected
		if (selected == 'Saved'){ // these are posts that the profile saved
			if (this.props.posts[user.id])
				return

			this.props.fetchSavedPosts(user)
		}		

		if (selected == 'Teams'){
			if (this.props.teams[user.id])
				return

			this.props.fetchTeams({'members.id': user.id})
		}
	}

	render(){
		const style = styles.account
		const user = this.props.user
		const selected = this.state.selected

		const sideMenu = (
			<div className="container clearfix">
				<div className="hidden-xs" style={{paddingTop:96}}></div>
				<nav id="primary-menu">
					<ul>
						{ this.state.menuItems.map((item, i) => {
								return (
									<li key={i}>
										<div style={(item == this.state.selected) ? style.selected : style.menuItem}>
											<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
										</div>
									</li>
								)
							})
						}
					</ul>
				</nav>
            </div>
		)

		let content = null
		if (selected == 'Teams'){
			content = (
				<div>
					{ (this.props.teams[user.id]) ? <TeamFeed teams={this.props.teams[user.id]} user={user} /> : null }
		            <h2 style={styles.title}>Create Team</h2>
					<hr />
					<CreateTeam
						user={this.props.user} 
						submit={this.createTeam.bind(this)} />

				</div>
			)
		}
		else if (selected == 'Messages')
			content = null

		const sidebar = (this.state.showMap) ? <Map center={this.props.session.currentLocation} zoom={14} animation={2} /> : sideMenu

		return (
			<div className="clearfix">
				<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
		            <div id="header-wrap">
		            	{ sidebar }
		            </div>
				</header>

				<section id="content" style={style.content}>
					<div className="content-wrap container clearfix">

						<div className="col_two_third">
							{ content }
						</div>

						<div className="col_one_third col_last">
							<div>
								{ (this.state.showEdit) ? null : <button onClick={this.editProfile.bind(this)} style={{float:'right'}} className="button button-small button-circle button-blue">Edit</button> }
								<h3 style={styles.team.title}>Profile</h3>
								<hr style={{marginBottom:12}} />
								{ (this.state.showEdit) ? <EditProfile update={this.updateProfile.bind(this)} profile={user} close={this.editProfile.bind(this)} /> :
									<div>
										<h4 style={styles.header}>{ user.title }</h4>
										<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(user.bio)}}></p>
										<img src={user.image+'=s220-c'} />
									</div>
								}
							</div>
						</div>

					</div>
				</section>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		session: state.session,
		posts: state.profile.posts,
		teams: state.team
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateProfile: (profile, params) => dispatch(actions.updateProfile(profile, params)),
		fetchSavedPosts: (profile) => dispatch(actions.fetchSavedPosts(profile)),
		unsavePost: (post, profile) => dispatch(actions.unsavePost(post, profile)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		createTeam: (team) => dispatch(actions.createTeam(team))
	}
}
export default connect(stateToProps, mapDispatchToProps)(Account)

