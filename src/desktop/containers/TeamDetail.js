import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { Modal } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { CreatePost, ProfilePreview, PostFeed, Comment } from '../view'
import { TextUtils, APIManager, FirebaseManager } from '../../utils'
import actions from '../../actions/actions'
import styles from './styles'

class TeamDetail extends Component {
	constructor(){
		super()
		this.memberFound = this.memberFound.bind(this)
		this.inviteMember = this.inviteMember.bind(this)
		this.state = {
			selected: 'All',
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
				'All',
				'News',
				'Hiring',
				'Showcase',
//				'Overview',
				'Community',
				'Members'
			],
			comments: [],
			comment: {
				text: ''
			},
			firebaseConnected: false
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const team = this.props.teams[this.props.slug]
		if (team == null){
			this.props.fetchTeams({slug: this.props.slug})
			.then(results => {
				if (results.length == 0)
					return

				// this.connectToFirebase()
			})
			.catch(err => {
				console.log('ERROR:' + err)
			})
			return
		}

		let updated = Object.assign({}, this.state.updatedTeam)
		updated['image'] = team.image
		this.setState({
			updatedTeam: updated
		})

//		this.connectToFirebase()


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

	connectToFirebase(){
		if (this.state.firebaseConnected)
			return

		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		FirebaseManager.register('/'+team.id+'/community', (err, currentComments) => {
			if (err){
				return
			}

			if (currentComments == null)
				return

			this.setState({
				comments: currentComments.reverse(),
				firebaseConnected: true
			})
		})		
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

		if (action == 'comment')
			this.submitComment()

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

	submitPost(post){
		const user = this.props.user
		post['saved'] = [user.id]
		post['type'] = (this.state.selected == 'All') ? 'news' : this.state.selected.toLowerCase()
		post['author'] = {
			id: user.id,
			name: user.username,
			slug: user.slug,
			image: (user.image.length == 0) ? null : user.image,
			type: 'profile'
		}

		const team = this.props.teams[this.props.slug]
		post['teams'] = [team.id]

		this.props.createPost(post)
		.then(response => {
			browserHistory.push('/post/'+response.result.slug)
		})
		.catch(err => {
			alert(err)
		})
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

	updateComment(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.comment)
		updated['text'] = event.target.value
		this.setState({
			comment: updated
		})
	}

	submitComment(event){
		if (event != null)
			event.preventDefault()

		const profile = this.props.user
		if (profile == null){
			alert('Please Log In or Register')
			return
		}

		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		if (this.state.comment.text.length == 0){
			alert('Please enter a comment')
			return
		}

		let updated = Object.assign({}, this.state.comment)
		updated['team'] = team.id
		const timestamp = Date.now()
		updated['timestamp'] = timestamp
		updated['id'] = Math.floor(timestamp/1000)
		updated['profile'] = {
			id: profile.id,
			username: profile.username,
			slug: profile.slug,
			image: profile.image
		}

		const path = '/'+team.id+'/community/'+this.state.comments.length
		FirebaseManager.post(path, updated, () => {
//			console.log('comment posted')
			this.setState({
				comment: {
					text: ''
				}
			})
		})
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
		if (selected == 'All'){
			if (this.props.posts[team.id] == null)
				this.props.fetchPosts({teams: team.id})
		}

		if (selected == 'Members'){
			if (this.props.profiles[team.id] == null)
				this.props.fetchProfiles({teams: team.id})
		}

		if (selected == 'Community'){
			if (this.state.firebaseConnected == false)
				this.connectToFirebase()
		}

	}


	render(){
		const team = this.props.teams[this.props.slug]
		if (team == null){
			return (<div></div>) // blank while team fetches
		}

		const style = styles.team
		let invite = null
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

		else if (selected == 'All' || selected == 'News' || selected == 'Hiring' || selected == 'Showcase'){
			const list = this.props.posts[team.id]
			const sublist = (selected == 'All') ? list : list.filter((post, i) => {
				return (post.type == selected.toLowerCase())
			})

			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					{ (this.props.user != null) ? <div className="hidden-xs"><CreatePost submit={this.submitPost.bind(this)} /></div> : (
							<div className="alert alert-success">
							  <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
							  <i className="icon-gift"></i>Please log in to submit a post.
							</div>
						) 
					}

					{ (list) ? <PostFeed deletePost={this.deletePost.bind(this)} posts={sublist} user={this.props.user} /> : null }
				</div>
			)
		}
		else if (selected == 'Overview'){
			let btnEdit = null
			if (this.props.user != null){
				if (this.memberFound(this.props.user, team.admins))
					btnEdit = <button onClick={this.toggleEditing.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Edit</button>
			}

			content = (
				<div>
					<div style={{textAlign:'right', marginBottom:24}}>
						{ btnEdit }
					</div>
					<div>
						<div className="hidden-xs">
							<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
						</div>

						{/* mobile UI*/}
						<div className="visible-xs" style={{padding:'0px 24px 0px 24px'}}>
							{ (team.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginBottom:12}} src={team.image+'=s160-c'} /> }
							<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
						</div>

					</div>
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
					<div style={{textAlign:'right', marginBottom:24}}>
						{ invite }
					</div>
					<div>
						{ (members == null) ? null : members.map((member, i) => {
								return <ProfilePreview key={member.id} profile={member} />
							})
						}
					</div>
				</div>
			)
		}
		else if (selected == 'Community'){
			content = (
				<div style={{border:'1px solid #ddd', marginTop:24, marginBottom:0}}>
					<div style={{overflow:'scroll', maxHeight:360, background:'#FCFDFF'}}>
						{ this.state.comments.map((comment, i) => {
								return (
									<Comment key={comment.id} comment={comment} />
								)
							})
						}
					</div>
					<input style={localStyle.input} placeholder="Enter Comment" onChange={this.updateComment.bind(this)} onKeyPress={this.keyPress.bind(this, 'comment')} value={this.state.comment.text} type="text" />
				</div>
			)
		}

		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#fff', border:'none'}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								<div style={{paddingTop:96}}></div>
								<div>
									<h2 style={style.title}>{ team.name }</h2>
									<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span>
									<hr />

									<nav>
										<ul style={{listStyleType:'none'}}>
											{ this.state.menuItems.map((item, i) => {
													const itemStyle = (item == this.state.selected) ? localStyle.selected : localStyle.menuItem
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
			            </div>
					</header>

					<section id="content" style={{background:'#fff', minHeight:800}}>
						<div className="content-wrap container clearfix">
							<div className="col_two_third">
								<div className="feature-box center media-box fbox-bg">
									<div style={styles.main}>
										{ content }
									</div>
								</div>
							</div>

							<div className="col_one_third col_last">
								<div style={{border:'1px solid #ddd', marginTop:24, padding:24, background:'#f9f9f9', textAlign:'right'}}>
									{ (team.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={team.image+'=s140-c'} /> }
									<h3 style={styles.team.title}>{team.name}</h3>
									<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span>
									<hr />
									<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
								</div>
							</div>
						</div>
					</section>
				</div>

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<select onChange={this.selectItem.bind(this, '')} style={localStyle.select} id="select">
								<option value="All">All</option>
								<option value="News">News</option>
								<option value="Hiring">Hiring</option>
								<option value="Showcase">Showcase</option>
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
	input: {
		color:'#333',
		background: '#f9f9f9',
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%',
		marginTop: 0
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
	},
	selected: {
		padding: '6px 6px 6px 16px',
		background: '#f9f9f9',
		borderRadius: 2,
		borderLeft: '3px solid rgb(91, 192, 222)',
		fontSize: 16,
		fontWeight: 400
	},
	menuItem: {
		padding: '6px 6px 6px 16px',
		background: '#fff',
		borderLeft: '3px solid #ddd',
		fontSize: 16,
		fontWeight: 100

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
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		createPost: (params) => dispatch(actions.createPost(params))
	}
}

export default connect(stateToProps, dispatchToProps)(TeamDetail)
