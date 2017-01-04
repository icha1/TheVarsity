import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { Modal } from 'react-bootstrap'
import { CreatePost, CreateComment, Comment, ProfilePreview, PostFeed, Redeem } from '../view'
import { TextUtils, APIManager } from '../../utils'
import actions from '../../actions/actions'
import styles from './styles'

class TeamDetail extends Component {
	constructor(){
		super()
		this.memberFound = this.memberFound.bind(this)
		this.inviteMember = this.inviteMember.bind(this)
		this.state = {
			selected: 'Feed',
			isEditing: false,
			showInvite: false,
			invitation: {
				name: '',
				email: ''
			},
			updatedTeam: {
				changed: false
			},
			menuItems: [
				'Feed',
				'Overview',
				'Members'
//				'Chat'
			]
		}
	}

	componentDidMount(){
		const team = this.props.teams[this.props.slug]
		if (team == null){
			this.props.fetchTeams({slug: this.props.slug})
			return
		}

		let updated = Object.assign({}, this.state.updatedTeam)
		updated['image'] = team.image
		this.setState({
			updatedTeam: updated
		})

		// Track view count:
		// const userId = (this.props.user == null) ? 'unregistered' : this.props.user.id
		// let updatedViewed = Object.assign({}, team.viewed)
		// updatedViewed[userId] = (updatedViewed[userId] == null) ? 1 : updatedViewed[userId]+1
		// let total = 0
		// Object.keys(updatedViewed).forEach((key, i) => {
		// 	if (key != 'total')
		// 		total += updatedViewed[key]
		// })

		// updatedViewed['total'] = total
		// this.props.updateTeam(team, {viewed: updatedViewed})
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)

		this.setState({
			isEditing: false,
			selected: item
		})
	}

	inviteMember(event){
		if (event)
			event.preventDefault()

		let updated = Object.assign({}, this.state.invitation)
		updated['from'] = {
			id: this.props.user.id,
			email: this.props.user.email,
			image: this.props.user.image
		}

		const team = this.props.teams[this.props.slug]
		updated['team'] = {
			id: team.id,
			name: team.name,
			image: team.image
		}

		updated['code'] = TextUtils.randomString(8)

		this.props.sendInvitation(updated)
		.then((response) => {
			this.setState({
				showInvite: false
			})
			
//			console.log('Invitation Sent: '+JSON.stringify(response))
			alert('Invitation Sent!')
		})
		.catch((err) => {
			console.log('ERROR: '+JSON.stringify(err))
		})
	}

	keyPress(action, event){
		if (event.charCode != 13)
			return

		if (action == 'invite')
			this.inviteMember()
	}	

	updateInvitation(event){
		let updated = Object.assign({}, this.state.invitation)
		updated[event.target.id] = event.target.value
		this.setState({
			invitation: updated
		})
	}

	toggleInvite(){
		this.setState({
			showInvite: !this.state.showInvite
		})
	}


	toggleEditing(){
		if (this.state.isEditing){
			// update team
			if (this.state.updatedTeam.changed == true){ // 0 if no changes
				const team = this.props.teams[this.props.slug]
				this.props.updateTeam(team, this.state.updatedTeam)
			}
		}

		this.setState({
			isEditing: !this.state.isEditing
		})
	}

	cancelEditing(){
		const team = this.props.teams[this.props.slug]

		this.setState({
			isEditing: false,
			updatedTeam: {
				changed: false,
				image: team.image
			}
		})
	}

	updateTeam(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.updatedTeam)
		updated[event.target.id] = event.target.value
		updated['changed'] = true
		this.setState({
			updatedTeam: updated
		})
	}

	uploadImage(source, files){
//		console.log('uploadImage: '+source)

		APIManager.upload(files[0], (err, image) => {
			if (err){
				alert(err)
				return
			}

			if (source == 'team'){
				let updated = Object.assign({}, this.state.updatedTeam)
				updated['image'] = image.address
				updated['changed'] = true
				this.setState({
					updatedTeam: updated
				})
			}
			else if (source == 'post'){
				let updated = Object.assign({}, this.state.post)
				updated['image'] = image.address
				this.setState({
					post: updated
				})
			}
		})
	}

	redeemInvitation(invitation){
		this.props.redeemInvitation(invitation)
		.then((response) => {
			console.log('REDEEM: '+JSON.stringify(response))
			window.location.href = '/account' // this is just easier for now
		})
		.catch((err) => {
			console.log('ERROR: ' + err)
			this.setState({
				error: err
			})
		})
	}

// 	scrapeWebsite(event){
// 		event.preventDefault()
// 		const team = this.props.teams[this.props.slug]
// 		if (team.social.website.length == 0)
// 			return

// 		let updated = Object.assign({}, this.state.updatedTeam)
// 		updated['useWebsite'] = true

// 		// already there
// 		if (team.screenshot.length > 0){
// 			updated['screenshot'] = team.screenshot
// 			this.setState({
// 				updatedTeam: updated
// 			})

// 			return
// 		}

// 		console.log('scrapeWebsite: '+team.social.website)

// 		APIManager
// 		.handleGet('/phantom', {url: team.social.website})
// 		.then(response => {
// //			console.log('PHANTOM JS: '+JSON.stringify(response))
// 			updated['screenshot'] = response.image['secure_url']
// 			this.setState({
// 				updatedTeam: updated
// 			})

// 			this.props.updateTeam(team, {screenshot: updated.screenshot})
// 		})
// 		.catch(err => {
// 			console.log('PHANTOM JS ERROR: '+JSON.stringify(err))
// 		})
// 	}

	submitPost(post){
		const user = this.props.user
		post['saved'] = [user.id]
		post['author'] = {
			id: user.id,
			name: user.username,
			slug: user.username,
			image: (user.image.length == 0) ? null : user.image,
			type: 'profile'
		}

		const team = this.props.teams[this.props.slug]
		post['teams'] = [team.id]

		this.props.createPost(post)
		.then(response => {
//			console.log('Post CREATED: '+JSON.stringify(response))
		})
		.catch(err => {
			alert(err)
		})
	}

	memberFound(profile, list){
		let isFound = false
		list.forEach((member, i) => {
			if (member.id == profile.id)
				isFound = true
		})

		return isFound
	}


	componentDidUpdate(){
		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		if (this.state.updatedTeam.image == null){
			let updated = Object.assign({}, this.state.updatedTeam)
			updated['image'] = team.image
			this.setState({
				updatedTeam: updated
			})
		}

		const selected = this.state.selected
		if (selected == 'Feed'){
			if (this.props.posts[team.id] == null)
				this.props.fetchPosts({teams: team.id})
		}

		if (selected == 'Members'){
			if (this.props.profiles[team.id] == null)
				this.props.fetchProfiles({teams: team.id})
//				console.log('FETCH MEMBERS: ')
		}
	}


	render(){
		const team = this.props.teams[this.props.slug]
		if (team == null){
			return (<div></div>) // blank while team fetches
		}

		const style = styles.team

		let invite = null
		let btnEdit = null
		if (this.props.user != null){
			if (this.memberFound(this.props.user, team.members))
				invite = <button onClick={this.toggleInvite.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Invite Member</button>
			
			if (this.memberFound(this.props.user, team.admins))
				btnEdit = <button onClick={this.toggleEditing.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Edit</button>
		}

		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (item == this.state.selected) ? style.selected : style.menuItem
			return (
				<li key={item}>
					<div style={itemStyle}>
						<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
					</div>
				</li>
			)
		})

		let content = null
		const selected = this.state.selected

		if (this.state.isEditing == true){
			content = (
				<div className="feature-box center media-box fbox-bg" style={{background:'#f9f9f9', borderRadius:'5px 5px 8px 8px'}}>
					<div className="fbox-desc">
						<div style={{textAlign:'left', padding:24, borderTop:'1px solid #ddd'}}>
							<button onClick={this.toggleEditing.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Done</button>
							<button onClick={this.cancelEditing.bind(this)} style={{float:'right', marginRight:12}} className={localStyle.btnBlue.className}>Cancel</button>
							<h2 style={styles.team.title}>Overview</h2>
							<hr />

							<div style={{textAlign:'center', marginTop:24}}>
								<Dropzone onDrop={this.uploadImage.bind(this, 'team')} style={{marginBottom:4}}>
									<img src={this.state.updatedTeam.image+'=s260'} />
									<br />
									Click to change
								</Dropzone>
								<textarea id="description" onChange={this.updateTeam.bind(this)} style={{marginTop:16, border:'none', fontSize:16, color:'#555', width:100+'%', minHeight:180, background:'#f9f9f9', padding:6}} defaultValue={team.description}></textarea>
							</div>
						</div>
					</div>
				</div>
			)			
		}

		else if (selected == 'Overview'){
			content = (
				<div className="feature-box center media-box fbox-bg">
					<div style={{textAlign:'left', padding:24}}>
						{ btnEdit }
						<h2 style={styles.team.title}>Overview</h2>
						<hr />
						<div style={{textAlign:'left', marginTop:24}}>
							<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
						</div>
					</div>
				</div>
			)
		}

		else if (selected == 'Feed'){
			const list = this.props.posts[team.id]
			content = (
				<div className="feature-box center media-box fbox-bg">
					<div style={{textAlign:'left', padding:24}}>
						<h2 style={styles.team.title}>Feed</h2>
						<hr />
						<div style={{textAlign:'left', marginTop:24}}>
							{ (list) ? <PostFeed posts={list} user={this.props.user} /> : null }
						</div>
					</div>
				</div>
			)
		}

		else if (selected == 'Members'){
			const members = this.props.profiles[team.id]
			content = (
				<div className="feature-box center media-box fbox-bg">
					<div style={{textAlign:'left', padding:24}}>
						{ invite }
						<h2 style={styles.team.title}>Members</h2>
						<hr />

						{ (members == null) ? null : members.map((member, i) => {
								return (
									<ProfilePreview key={member.id} profile={member} />
								)
							})
						}

					</div>
				</div>
			)
		}

		else if (selected == 'Chat'){
			
		}

		const submitPost = (
			<div>
				<h3 style={styles.team.title}>Submit Post</h3>
				<hr style={{marginBottom:12}} />
				{ (this.props.user == null) ? <div>Please log in to submit a post.</div> : <CreatePost submit={this.submitPost.bind(this)} /> }
			</div>
		) 

		return (
			<div className="clearfix">
				<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
		            <div id="header-wrap">
						<div className="container clearfix">
							<div className="hidden-xs" style={{paddingTop:96}}></div>
							<div>
								{ (team.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd'}} src={team.image+'=s140-c'} /> }
								<h2 style={style.title}>{ team.name }</h2>
								<hr className="hidden-xs" />
								<nav id="primary-menu">
									<ul>{sideMenu}</ul>
								</nav>
							</div>
			            </div>
		            </div>
				</header>

				<section id="content" style={{background:'#fff', minHeight:800}}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
							{ content }
						</div>

						<div className="col_one_third col_last">
							{ (selected == 'Feed') ? <div>{ submitPost }</div> :
								<div>
									<h3 style={styles.team.title}>Accept Invitation</h3>
									<hr style={{marginBottom:12}} />
									<Redeem error={this.state.error} submitInvite={this.redeemInvitation.bind(this)} />								
								</div>
							}
						</div>

					</div>
				</section>

		        <Modal bsSize="sm" show={this.state.showInvite} onHide={this.toggleInvite.bind(this)}>
			        <Modal.Body style={styles.nav.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={styles.nav.logo} src='/images/logo_dark.png' />
				        	<hr />
				        	<h4>Invite Member</h4>
			        	</div>

			        	<input id="name" onChange={this.updateInvitation.bind(this)} className={styles.nav.textField.className} style={styles.nav.textField} type="text" placeholder="Name" />
			        	<input id="email" onChange={this.updateInvitation.bind(this)} onKeyPress={this.keyPress.bind(this, 'invite')} className={styles.nav.textField.className} style={styles.nav.textField} type="text" placeholder="Email" />
						<div style={styles.nav.btnLoginContainer}>
							<a href="#" onClick={this.inviteMember.bind(this)} className={styles.nav.btnLogin.className}><i className="icon-lock3"></i>Send</a>
						</div>
			        </Modal.Body>
		        </Modal>

			</div>
		)
	}
}

const localStyle = {
	btnBlue: {
		float: 'right',
		className: 'button button-small button-circle button-blue'
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
	textarea: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 16,
		border: 'none',
		width: 100+'%',
		fontFamily:'Pathway Gothic One',
		minHeight: 220
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		session: state.session, // currentDistrict, currentLocation, teams, selectedFeed, reload
		teams: state.team,
		posts: state.post,
		profiles: state.profile
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		updateTeam: (team, params) => dispatch(actions.updateTeam(team, params)),
		sendInvitation: (params) => dispatch(actions.sendInvitation(params)),
		redeemInvitation: (invitation) => dispatch(actions.redeemInvitation(invitation)),
		createPost: (params) => dispatch(actions.createPost(params))
	}
}

export default connect(stateToProps, dispatchToProps)(TeamDetail)
