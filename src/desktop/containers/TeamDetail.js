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
		window.scrollTo(0, 0)
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
			selected: (event.target.id == 'select') ? event.target.value : item
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

		updated['code'] = TextUtils.randomString(6)

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
			slug: user.slug,
			image: (user.image.length == 0) ? null : user.image,
			type: 'profile'
		}

		const team = this.props.teams[this.props.slug]
		post['teams'] = [team.id]

		window.scrollTo(0, 0)
		return this.props.createPost(post)
	}

	deletePost(post){
		console.log('Delete Post: '+post.title)
		const user = this.props.user
		if (user == null){
			alert('Please register or log in.')
			return
		}

		if (user.id != post.author.id)
			return

		this.props.updatePost(post, {status: 'closed'})
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
				<div style={{textAlign:'left'}}>
					<div style={{marginTop:24}}>
						<Dropzone onDrop={this.uploadImage.bind(this, 'team')} style={{marginBottom:4}}>
							<img src={this.state.updatedTeam.image+'=s260'} />
							<br />
							Click to change
						</Dropzone>
						<textarea id="description" onChange={this.updateTeam.bind(this)} style={{marginTop:16, border:'none', fontSize:16, color:'#555', width:100+'%', minHeight:180, background:'#f9f9f9', padding:6}} defaultValue={team.description}></textarea>
					</div>
					<button onClick={this.toggleEditing.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Done</button>
					<button onClick={this.cancelEditing.bind(this)} style={{float:'right', marginRight:12}} className={localStyle.btnBlue.className}>Cancel</button>
				</div>
			)			
		}

		else if (selected == 'Overview'){
			if (this.props.user != null){
				if (this.memberFound(this.props.user, team.admins))
					btnEdit = <button onClick={this.toggleEditing.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Edit</button>
			}

			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					<div className="hidden-xs">
						<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
					</div>

					{/* mobile UI*/}
					<div className="visible-xs" style={{padding:'0px 24px 0px 24px'}}>
						{ (team.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginBottom:12}} src={team.image+'=s160-c'} /> }
						<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
					</div>
				</div>
			)
		}

		else if (selected == 'Feed'){
			const list = this.props.posts[team.id]
			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					{ (list) ? <PostFeed deletePost={this.deletePost.bind(this)} posts={list} user={this.props.user} /> : null }
				</div>
			)
		}

		else if (selected == 'Members'){
			const members = this.props.profiles[team.id]
			if (this.props.user != null){
				if (this.memberFound(this.props.user, team.members))
					invite = <button onClick={this.toggleInvite.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Invite Member</button>
			}

			content = (
				<div>
					{ (members == null) ? null : members.map((member, i) => {
							return <ProfilePreview key={member.id} profile={member} />
						})
					}
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
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								<div style={{paddingTop:96}}></div>
								<div>
									{ (team.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={team.image+'=s140-c'} /> }
									<h2 style={style.title}>{ team.name }</h2>
									<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span>
									<hr />
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
								<div className="feature-box center media-box fbox-bg">
									<div style={styles.main}>
										{ btnEdit } 
										{ invite }
										<h2 style={styles.team.title}>{this.state.selected}</h2>
										<hr />
										{ content }
									</div>
								</div>
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
				</div>

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<select onChange={this.selectItem.bind(this, '')} style={localStyle.select} id="select">
								<option value="Feed">Feed</option>
								<option value="Overview">Overview</option>
								<option value="Members">Members</option>
							</select>
						</div>

						<div style={{textAlign:'right'}} className="col-xs-6">
							{ (team.image.length == 0) ? null : <img style={{float:'right', borderRadius:24, marginLeft:12}} src={team.image+'=s48-c'} /> }
							<h3 style={style.title}>{ team.name }</h3>
							<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span>
						</div>
					</div>

					{ content }
				</div>
				{ /* end mobile UI */ }

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
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		createPost: (params) => dispatch(actions.createPost(params))
	}
}

export default connect(stateToProps, dispatchToProps)(TeamDetail)
