import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import { EditProfile, CreateProject, CreatePost, TeamFeed, CreateTeam, PostFeed, Map } from '../view'
import { connect } from 'react-redux'
import { TextUtils, Alert } from '../../utils'
import actions from '../../actions/actions'
import styles from './styles'
import { browserHistory } from 'react-router'

class Account extends Component {
	constructor(){
		super()
		this.state = {
			showModal: false,
			showEdit: false,
			showMap: false,
			showCreateTeam: false,
			showCreateProject: false,
			selected: 'Profile',
			menuItems: [
				'Profile',
				'Projects'
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

		if (user.type == 'admin'){
			this.setState({
				menuItems: ['Profile', 'Projects', 'Hiring']
			})
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

	toggleShowCreateProject(){
		this.setState({
			showCreateProject: !this.state.showCreateProject
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
			Alert.showConfirmation({
				title: 'All Set',
				text: 'You password has been updated. Thanks!'
			})

			return
		})
		.catch(err => {
			alert(err)
		})
	}

	submitProject(post){
		const prepared = this.preparePost(post, 'project') // can be null
		if (prepared == null)
			return

		let slug = null
		this.props.createPost(prepared)
		.then(response => {
			slug = response.result.slug
			const user = this.props.user
			let projects = user.projects
			projects.push(response.result.id)
			return this.props.updateProfile(user, {projects: projects})
		})
		.then(response => {
			browserHistory.push('/project/'+slug)
			return response
		})
		.catch(err => {
			alert(err)
		})
	}	

	submitPost(post){
		const prepared = this.preparePost(post, 'hiring') // can be null
		if (prepared == null)
			return
		
		// find and remove any email strings:
		prepared['contact'] = TextUtils.findEmails(post.text)
		if (prepared.contact.length > 0){
			let text = prepared.text
			prepared.contact.forEach((email, i) => {
				text = text.replace(email, '')
			})
			prepared['text'] = text
		}

		this.props.createPost(prepared)
		.then(response => {
			browserHistory.push('/post/'+response.result.slug)
		})
		.catch(err => {
			alert(err)
		})
	}

	preparePost(post, type){
		const user = this.props.user
		if (user == null){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please log in or register to create a project.'
			})
			return null
		}

		post['saved'] = [user.id]
		post['type'] = type
		post['author'] = {
			id: user.id,
			name: user.username,
			slug: user.slug,
			image: (user.image.length == 0) ? null : user.image,
			type: 'profile'
		}

		return post
	}

	componentDidUpdate(){
		const user = this.props.user
		if (user == null)
			return

		const selected = this.state.selected
		if (selected == 'Hiring'){
			if (this.props.posts[user.id])
				return

			this.props.fetchPosts({'author.id': user.id})
		}


		if (selected == 'Projects'){
			if (this.props.posts[user.id])
				return

			this.props.fetchPosts({'collaborators.id': user.id})
		}
	}

	render(){
		const style = styles.account
		const selected = this.state.selected
		
		const user = this.props.user
		const teams = this.props.teams[user.id] // can be null

		const city = user.location.city || ''
		const state = user.location.state || ''

		let image = null
		let username = null
		if (user != null){
			username = user.username
			image = (user.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd'}} src={user.image+'=s140-c'} />
		}

		let content = null
		let cta = null

		if (selected == 'Profile'){
			content = (
				<div>
					<div className="hidden-xs" style={{textAlign:'left', marginTop:48}}>
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

					<div className="visible-xs" style={{padding:'0px 16px 0px 16px'}}>
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
				</div>
			)
		}
		else if (selected == 'Projects'){
			cta = <button onClick={this.toggleShowCreateProject.bind(this)} style={{float:'right'}} className="button button-small button-border button-border-thin button-blue">{ (this.state.showCreateProject) ? 'Cancel' : 'Create Project' }</button>
			if (this.state.showCreateProject)
				content = <CreateProject teams={teams} onCreate={this.submitProject.bind(this)} />
			else {
				const list = this.props.posts[user.id]
				const projects = (list == null) ? [] : list.filter((post, i) => {
					return (post.type == 'project')
				})

				content = (
					<div style={{textAlign:'left', marginTop:24}}>
						<PostFeed deletePost={this.deletePost.bind(this)} posts={projects} user={user} />
					</div>
				)
			}
		}
		else if (selected == 'Hiring'){
			content = null
			cta = <button onClick={this.toggleShowCreateProject.bind(this)} style={{float:'right'}} className="button button-small button-border button-border-thin button-blue">{ (this.state.showCreateProject) ? 'Cancel' : 'Submit Post' }</button>
			if (this.state.showCreateProject)
				content = <CreatePost teams={teams} submit={this.submitPost.bind(this)} />
			else {
				const list = this.props.posts[user.id]
				const sublist = (list == null) ? [] : list.filter((post, i) => {
					return (post.type == 'hiring')
				})

				content = (
					<div style={{textAlign:'left', marginTop:24}}>
						<PostFeed deletePost={this.deletePost.bind(this)} posts={sublist} user={user} />
					</div>
				)
			}			
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
										<img style={localStyle.profileImage} src={user.image+'=s140-c'} />
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
										{ cta }
										<h2 style={styles.team.title}>{this.state.selected}</h2>
										<hr />
										{ content }
									</div>
								</div>

							</div>

							<div className="col_one_third col_last">
								<h2 style={styles.title}>Your Teams</h2>
								<hr />
								{ (this.state.showCreateTeam) ? <CreateTeam user={this.props.user} cancel={this.toggleCreateTeam.bind(this)} submit={this.createTeam.bind(this)} /> : 
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
								}

								{ (this.state.showCreateTeam) ? null : <button onClick={this.toggleCreateTeam.bind(this)} className="button button-small button-border button-border-thin button-blue">Create Team</button> }
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
								<option value="Projects">Projects</option>
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
	},
	subtext: {
		fontWeight:100,
		fontSize:14,
		lineHeight:14+'px'
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
		createTeam: (team) => dispatch(actions.createTeam(team)),
		createPost: (params) => dispatch(actions.createPost(params))
	}
}
export default connect(stateToProps, mapDispatchToProps)(Account)

