import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { EditProfile, TeamFeed, CreateTeam, PostFeed, Map } from '../view'
import { connect } from 'react-redux'
import { TextUtils } from '../../utils'
import actions from '../../actions/actions'
import styles from './styles'

class Account extends Component {
	constructor(){
		super()
		this.state = {
			showModal: false,
			showEdit: false,
			showMap: false,
			showCreateTeam: false,
			selected: 'Teams',
			menuItems: [
				'Teams',
//				'Profile',
				'Messages'
			],
			passwords: {}
		}
	}

	componentDidMount(){
		const user = this.props.user
		if (user == null)
			return

		if (user.isConfirmed != 'yes'){
			setTimeout(() => {
				this.setState({
					showModal: true
				})
			}, 750)			
		}

		if (this.props.teams[user.id])
			return

		this.props.fetchTeams({'members.id': user.id}) // fetch teams if necessary
	}

	selectItem(item, event){
		event.preventDefault()

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

	// toggleMap(event){
	// 	event.preventDefault()
	// 	this.setState({
	// 		showMap: !this.state.showMap
	// 	})
	// }

	toggleModal(){
		this.setState({
			showModal: !this.state.showModal
		})
	}

	toggleCreateTeam(){
		this.setState({
			showCreateTeam: !this.state.showCreateTeam
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
		const user =  this.props.user
		if (user == null){
			alert('Please log in or register to create a team.')
			return
		}

		const membersList = [{id: user.id, username: user.username, image: user.image}]
		team['members'] = membersList
		team['admins'] = membersList
		let slug = null

		this.props.createTeam(team)
		.then((response) => {
			const result = response.result
			slug = result.slug
			let teamsArray = user.teams
			teamsArray.push(result.id)
			return this.props.updateProfile(user, {teams: teamsArray}) // update profile with teams array
		})
		.then(resp => { // this is the updated profile
			window.location.href = '/team/'+slug
		})
		.catch(err => {
			alert(err)
		})
	}

	updatePassword(event){
		let updated = Object.assign({}, this.state.passwords)
		updated[event.target.id] = event.target.value
		this.setState({
			passwords: updated
		})
	}

	submitPassword(event){
		event.preventDefault()
//		console.log('submitPassword: '+JSON.stringify(this.state.passwords))

		let passwords = this.state.passwords
		if (passwords.password1 == null){
			alert('Please complete both fields.')
			return
		}

		if (passwords.password2 == null){
			alert('Please complete both fields.')
			return
		}

		if (passwords.password1 !== passwords.password2){
			alert('Passwords do not match.')
			return
		}

		const user = this.props.user
		if (user == null)
			return

		const params = {
			isConfirmed: 'yes',
			password: passwords.password1
		}

		this.setState({showModal: false})
		this.props.updateProfile(user, params)
		.then(result => {
//			console.log('PROFILE UPDATED: '+JSON.stringify(result))
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
					{ (!this.state.showCreateTeam) ? <button onClick={this.toggleCreateTeam.bind(this)} style={{float:'right'}} className="button button-small button-circle button-blue">Create Team</button> : 
						<div>
				            <h2 style={styles.title}>Create Team</h2>
							<hr />
							<CreateTeam
								user={this.props.user} 
								submit={this.createTeam.bind(this)} />
						</div>
					}
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

		        <Modal bsSize="sm" show={this.state.showModal} onHide={this.toggleModal.bind(this)}>
			        <Modal.Body style={styles.nav.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={styles.nav.logo} src='/images/logo_dark.png' />
				        	<hr />
				        	<h4>Set Password</h4>
			        	</div>

			        	<input id="password1" onChange={this.updatePassword.bind(this)} className={styles.nav.textField.className} style={styles.nav.textField} type="password" placeholder="Password" />
			        	<input id="password2" onChange={this.updatePassword.bind(this)} className={styles.nav.textField.className} style={styles.nav.textField} type="password" placeholder="Repeat Password" />
						<div style={styles.nav.btnLoginContainer}>
							<a href="#" onClick={this.submitPassword.bind(this)} className={styles.nav.btnLogin.className}><i className="icon-lock3"></i>Update Password</a>
						</div>
			        </Modal.Body>
		        </Modal>

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

