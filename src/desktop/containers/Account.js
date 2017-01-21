import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import { EditProfile, TeamFeed, CreateTeam, PostFeed, Map } from '../view'
import { connect } from 'react-redux'
import { TextUtils, Alert } from '../../utils'
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
			selected: 'Profile',
			menuItems: [
				'Profile',
				'Teams',
				'Posts'
//				'Messages'
			],
			passwords: {}
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
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
		window.scrollTo(0, 0)
		this.setState({
			showEdit: false,
			selected: (event.target.id == 'select') ? event.target.value : item
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

	deletePost(post){
		console.log('Delete Post: '+post.title)
		const user = this.props.user
		if (user == null){
			alert('Please register or log in.')
			return
		}

		this.props.updatePost(post, {status: 'closed'})
	}

	createTeam(team){
		const user =  this.props.user
		if (user == null){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please log in or register to create a team.'
			})
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
			alert('You password has been updated. Thanks!')
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
		if (selected == 'Teams'){
			if (this.props.teams[user.id])
				return

			this.props.fetchTeams({'members.id': user.id})
		}

		if (selected == 'Posts'){
			if (this.props.posts[user.id])
				return

			this.props.fetchPosts({'author.id': user.id})
		}

	}

	render(){
		const style = styles.account
		const selected = this.state.selected
		
		const user = this.props.user
		const city = user.location.city || ''
		const state = user.location.state || ''

		let image = null
		let username = null
		if (user != null){
			username = user.username
			image = (user.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd'}} src={user.image+'=s140-c'} />
		}

		let content = null
		if (selected == 'Teams'){
			const teamList = (this.props.teams[user.id] == null) ? null : (
				<div style={{textAlign:'left', marginTop:24}}>
					<TeamFeed teams={this.props.teams[user.id]} user={user} />
				</div>
			)

			content = (
				<div>
					{ (!this.state.showCreateTeam) ? teamList :
						<div>
							<CreateTeam
								user={this.props.user} 
								submit={this.createTeam.bind(this)} />
						</div>
					}
				</div>
			)
		}
		else if (selected == 'Profile'){
			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					{ (this.state.showEdit) ? null : <button onClick={this.editProfile.bind(this)} style={{float:'right'}} className="button button-small button-circle button-blue">Edit</button> }
					{ (this.state.showEdit) ? <EditProfile update={this.updateProfile.bind(this)} profile={user} close={this.editProfile.bind(this)} /> :
						<div>
							<h4 style={styles.header}>{ user.username }</h4>
							<h4 style={styles.header}>{ user.title }</h4>
							<h4 style={styles.header}>{ TextUtils.capitalize(city)+', '+state.toUpperCase() }</h4>
							<p className="lead" style={{fontSize:16, color:'#555', marginTop:12, marginBottom:24}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(user.bio)}}></p>
							<img src={user.image+'=s220-c'} />
						</div>
					}
				</div>
			)
		}
		else if (selected == 'Posts'){
			const list = this.props.posts[user.id]
			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					{ (list) ? <PostFeed deletePost={this.deletePost.bind(this)} posts={list} user={user} /> : null }
				</div>
			)
		}
		else if (selected == 'Messages')
			content = null

		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9', paddingTop:96}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								{ (user == null) ? null : 
									<div>
										<img style={localStyle.profileImage} src={user.image+'=s140'} />
										<h2 style={ styles.team.title }>
											<Link to={'/profile/'+user.slug}>{ user.username }</Link>
										</h2>
										<span style={styles.paragraph}>{ user.title }</span><br />
										<span style={styles.paragraph}>{ user.location.city }</span><br />
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

								<div className="feature-box center media-box fbox-bg">
									<div style={styles.main}>
										{ (selected == 'Teams') ? <button onClick={this.toggleCreateTeam.bind(this)} style={{float:'right'}} className="button button-small button-circle button-blue">{ (this.state.showCreateTeam) ? 'Cancel' : 'Create Team'}</button> : null }
										<h2 style={styles.team.title}>{this.state.selected}</h2>
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

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<select onChange={this.selectItem.bind(this, '')} style={localStyle.select} id="select">
								<option value="Profile">Profile</option>
								<option value="Teams">Teams</option>
								<option value="Posts">Posts</option>
							</select>
						</div>

						{ (user == null) ? null : 
							<div style={{textAlign:'right'}} className="col-xs-6">
								{ (user.image.length == 0) ? null : <img style={{float:'right', borderRadius:24, marginLeft:12}} src={user.image+'=s48-c'} /> }
								<h3 style={styles.post.title}>Account</h3>
							</div>
						}						
					</div>
					{ content }
				</div>
				{ /* end mobile UI */ }

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
	},	
	btnBlue: {
		backgroundColor:'rgb(91, 192, 222)'
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		session: state.session,
		posts: state.post,
		teams: state.team
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateProfile: (profile, params) => dispatch(actions.updateProfile(profile, params)),
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		createTeam: (team) => dispatch(actions.createTeam(team))
	}
}
export default connect(stateToProps, mapDispatchToProps)(Account)

