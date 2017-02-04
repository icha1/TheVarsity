import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { CreatePost, CreateProject, Comments, Milestone, CreateMilestone, Profiles, Modal, Redeem } from '../view'
import { FirebaseManager, TextUtils, APIManager, Alert } from '../../utils'
import styles from './styles'
import { Link } from 'react-router'
import Section from './Section'
import BaseContainer from './BaseContainer'

class ProjectDetail extends Component {
	constructor(){
		super()
		this.state = {
			showInvite: false,
			timestamp: null,
			isEditing: false,
			comments: null,
			loading: false,
			selected: 'Project',
			menuItems: ['Project', 'Notes', 'Collaborators'],
			invitation: {
				name: '',
				email: ''
			},
			milestone: {
				title: '',
				description: '',
				attachments: []
			}
		}
	}

	componentWillMount(){
		const project = this.props.projects[this.props.slug]
		if (project == null)
			return
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const project = this.props.projects[this.props.slug]
		if (project == null){
			this.props.fetchProjects({slug: this.props.slug})
			return
		}

		if (this.props.milestones[project.id] != null)
			return

		// fetch milestones
		this.props.fetchMilestones({'project.id': project.id})
		.then(results => {
			return results
		})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
		})
	}

	componentDidUpdate(){
		const project = this.props.projects[this.props.slug]
		if (project == null)
			return

		const selected = this.state.selected

		if (selected == 'Project'){
			if (this.props.milestones[project.id] != null)
				return

			// fetch milestones
			this.props.fetchMilestones({'project.id': project.id})
			.then(results => {
				return results
			})
			.catch(err => {
				console.log('ERROR: '+JSON.stringify(err))
			})
		}

		if (selected == 'Collaborators'){
			if (this.props.profiles[project.id] != null)
				return

			this.props.fetchProfiles({projects: project.id})
			.then(response => {})
			.catch(err => {
				console.log('ERROR: '+JSON.stringify(err))
			})
		}

		if (selected == 'Notes'){
			if (this.state.comments != null)
				return

			this.props.fetchComments({'thread.id':project.id})
			.then(results => {
				this.setState({
					comments: results
				})

				return results
			})
			.then(results => {
				const author = this.props.profiles[post.author.slug]
				if (author == null)
					return this.props.fetchProfile(post.author.id)
			})
			.catch(err => {
				console.log('ERROR: '+JSON.stringify(err))
			})
		}
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)
		this.setState({
			selected: (item.length == 0) ? event.target.value : item
		})
	}

	updateComment(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.comment)
		updated[event.target.id] = event.target.value
		this.setState({
			comment: updated,
		})
	}

	submitComment(event){
		if (event.charCode != 13)
			return

		const project = this.props.projects[this.props.slug]
		if (project == null)
			return

		const user = this.props.user
		if (user == null)
			return

		let comment = {text: event.target.value}
		comment['thread'] = {
			id: project.id,
			schema: project.schema,
			subject: project.title,
			image: project.image
		}

		comment['profile'] = {
			id: user.id,
			username: user.username,
			slug: user.slug,
			image: user.image
		}

		event.persist()
		this.props.createComment(comment)
		.then(response => {
			let updated = Object.assign([], this.state.comments)
			event.target.value = ''
			updated.push(response.result)
			this.setState({
				comments: updated
			})
		})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
		})
	}

	toggleEditing(){
		this.setState({
			isEditing: !this.state.isEditing
		})
	}

	// todo: run this through base container
	updateProject(type, project, authRequired){
		if (this.state.isEditing == false)
			return

//		console.log('UPDATE PROJECT: '+JSON.stringify(project))
		let updated = Object.assign({}, project)
		const original = this.props.projects[this.props.slug]
		this.props.updatePost(original, updated)
		.then(response => {
			this.setState({
				isEditing: !this.state.isEditing
			})
		})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
		})
	}

	toggleInvite(event){
		if (event)
			event.preventDefault()

		this.setState({
			showInvite: !this.state.showInvite
		})
	}

	memberFound(profile, list){
		if (profile == null)
			return false

		let isFound = false
		list.forEach((member, i) => {
			if (member.id == profile.id)
				isFound = true
		})

		return isFound
	}

	updateInvitation(event){
		let updated = Object.assign({}, this.state.invitation)
		updated[event.target.id] = event.target.value
		this.setState({
			invitation: updated
		})
	}

	inviteCollaborator(event){
		if (event)
			event.preventDefault()

		if (this.state.invitation.name.length == 0){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please Enter a Name'
			})
			return
		}

		if (this.state.invitation.email.length == 0){
			Alert.showAlert({
				title: 'Oops',
				text: 'Please Enter an Email'
			})
			return
		}

		let updated = Object.assign({}, this.state.invitation)
		updated['from'] = {
			id: this.props.user.id,
			email: this.props.user.email,
			image: this.props.user.image
		}

//		console.log('INVITE Collaborator: '+JSON.stringify(updated))

		const project = this.props.projects[this.props.slug]
		updated['context'] = {
			type: 'project',
			id: project.id,
			name: project.title,
			image: project.image,
			slug: project.slug
		}

 		updated['code'] = TextUtils.randomString(6)
 		this.setState({showInvite: false})

		this.props.sendInvitation(updated)
		.then((response) => {
			if (response.recipient != null){ // invitee already registered, post to Firebase
				const path = '/'+response.recipient.id+'/notifications/'+response.invitation.id 
				FirebaseManager.post(path, response.invitation, () => {

				})
			}

			Alert.showConfirmation({
				title: 'Invitation Sent!',
				text: 'Thanks for inviting your friend to The Varsity.'
			})
		})
		.catch((err) => {
			Alert.showAlert({
				title: 'Error',
				text: err.message || err
			})
		})
	}

	updateMilestone(field, event){
		// console.log('updateMilestone: '+field+' = '+event.target.value)
		let updated = Object.assign({}, this.state.milestone)
		updated[field] = event.target.value
		this.setState({
			milestone: updated
		})
	}

	createMilestone(){
		const user = this.props.user // can be null
		if (user == null)
			return

		const project = this.props.projects[this.props.slug]
		if (project == null)
			return

		if (this.state.milestone.title.length == 0){
			Alert.showAlert({
				title: 'Oops.',
				text: 'Please enter a title for your milestone.'
			})
			return
		}

		if (this.state.milestone.description.length == 0){
			Alert.showAlert({
				title: 'Oops.',
				text: 'Please enter a description for your milestone.'
			})
			return
		}

		let updated = Object.assign({}, this.state.milestone)

		// add profile, add project
		updated['profile'] = {
			id: user.id,
			username: user.username,
			slug: user.slug,
			image: user.image
		}

		updated['project'] = {
			id: project.id,
			title: project.title,
			slug: project.slug,
			image: project.image
		}

		updated['teams'] = Object.assign([], user.teams)

		this.props.createMilestone(updated)
		.then(response => {
//			console.log('Milestone Created: '+JSON.stringify(response))
			this.setState({
				milestone: {
					title: '',
					description: '',
					attachments: []
				}
			})
		})
		.catch(err => {

		})
	}

	requestInvite(invitation){
		const project = this.props.projects[this.props.slug]
		if (project == null)
			return

		invitation['context'] = {
			type: 'project',
			image: project.image,
			name: project.title,
			slug: project.slug,
			id: project.id
		}

		return this.props.requestInvitation(invitation)
	}

	uploadFile(files){
		const file = files[0]
		let mime = null
		const mimeTypes = ['image', 'video', 'zip', 'pdf', 'audio']

		mimeTypes.forEach((type, i) => {
			if (file.type.indexOf(type) != -1){
				mime = type
			}
		})

		if (mime == null){
			Alert.showAlert({
				title:'Oops!',
				text: 'Uploads can only be image, video, pdf, or .zip files.'
			})
			return
		}

		// const maxSize = 41943040
		// if (file.size > maxSize){
		// 	Alert.showAlert({
		// 		title:'Oops!',
		// 		text: 'File exceeds max size. Uploads cannot exceed 40 MB.'
		// 	})
		// 	return
		// }

		this.setState({loading: true})

		// send images and pdf to your service, video to cloudinary, application to S3
		let updated = Object.assign({}, this.state.milestone)
		let attachments = Object.assign([], updated.attachments)
		let attachment = {
			name: file.name,
			size: file.size,
			mime: mime
		}

		/* Upload images and pdf to your service, everything else to S3: */

		if (mime == 'image' || mime == 'pdf'){
			APIManager.upload(file, (err, response) => {
				if (err){
					Alert.showAlert({
						title: 'Oops!',
						text: err
					})

					return
				}

				attachment['address'] = response.address
				attachments.push(attachment)
				updated['attachments'] = attachments
				console.log(mime.toUpperCase()+' UPLOADED: '+JSON.stringify(attachment))
				this.setState({
					loading: false,
					milestone: updated
				})
			})
			return
		}

		/* Upload to S3: */
		const filename = TextUtils.randomString(8)+'-'+file.name
		let url = null

		APIManager.handleGet('/aws', {filename:filename, filetype:file.type})
		.then(response => {
			url = response.url
			return APIManager.directUpload(file, response.signedRequest)
		})
		.then(response => {
			attachment['address'] = url
			attachments.push(attachment)
			updated['attachments'] = attachments
			this.setState({
				loading: false,
				milestone: updated
			})

			return response
		})
		.catch(err => {
			console.log('ERROR: '+err)
		})
	}

	render(){
		const project = this.props.projects[this.props.slug]
		if (project == null)
			return <div></div>

		const style = styles.post
		const user = this.props.user // can be null
		const author = (project == null) ? null : this.props.profiles[project.author.slug]
		const isCollaborator = (project) ? this.memberFound(user, project.collaborators) : false

		let content = null
		const selected = this.state.selected

		if (this.state.isEditing == true){
			content = (
				<div>
					<div className="col_two_third col_last">
						<button onClick={this.toggleEditing.bind(this)} className={localStyle.btnSmall.className} style={{float:'right'}}>Cancel</button>
						<div style={{marginBottom:24}} className="clearfix"></div>
						<CreateProject project={project} onCreate={this.updateProject.bind(this)} />
					</div>
				</div>
			)
		}
		else if (selected == 'Project'){
			let btnEdit = null
			const projectAuthor = project.author
			if (user != null){
				if (user.id == projectAuthor.id)
					btnEdit = <button onClick={this.toggleEditing.bind(this)} className={localStyle.btnSmall.className} style={{float:'right'}}>Edit</button>
			}

			let images = Object.assign([], project.images)
			if (project.image.length > 0)
				images.unshift(project.image)

			content = (
				<div>
					<div className="col_two_third">
						<div className="feature-box center media-box fbox-bg">
							<div style={styles.main}>
								{ btnEdit }
								<h2 style={styles.team.title}>
									{project.title}
								</h2>
								<hr />
											
								<div className="hidden-xs" style={{lineHeight:18+'px', marginBottom:24}}>
									<img style={{marginRight:10, borderRadius:22, float:'left'}} src={projectAuthor.image+'=s44-c'} />
									<span><Link to={'/'+projectAuthor.type+'/'+projectAuthor.slug}>{ projectAuthor.name }</Link></span><br />
									<span style={{fontWeight:100, fontSize:11}}>{ this.state.timestamp }</span><br />
								</div>

								<p className="lead" style={{fontSize:16, color:'#555', marginBottom:24}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(project.text)}}></p>
								<ul className="entry-meta clearfix">
									{ images.map((image, i) => {
											return (
												<li key={image} style={{color:'#fff'}}>
													<a href={image+'=s1024'} data-lightbox="image">
														<img src={image+'=s72-c'} />
													</a>
												</li>
											)
										})
									}
								</ul>
							</div>
						</div>
					</div>

					<div className="postcontent nobottommargin col_last clearfix">
						<div id="posts" className="post-timeline clearfix">
							<div className="timeline-border"></div>
							{ (isCollaborator==false) ? null : 
								<CreateMilestone 
									loading={this.state.loading} 
									milestone={this.state.milestone}
									update={this.updateMilestone.bind(this)}
									uploadFile={this.uploadFile.bind(this)}
									submitMilestone={this.createMilestone.bind(this)} />
							}

							{ (this.props.milestones[project.id] == null) ? null : 
								this.props.milestones[project.id].map((milestone, i) => {
									return <Milestone key={milestone.id} {...milestone} />
								})
							}
						</div>
					</div>
				</div>
			)
		}
		else if (selected == 'Notes'){
			const list = this.state.comments || []
			content = (
				<div>
					<div className="col_two_third">
						<div className="feature-box center media-box fbox-bg">
							<div style={styles.main}>
								<h2 style={styles.team.title}>Notes</h2>
								<hr />
								<Comments 
									user={user}
									comments={list}
									submitComment={this.submitComment.bind(this)} />
							</div>
						</div>
					</div>

					{ (isCollaborator) ? null : 
						<div className="col_one_third col_last">
							<h2 style={style.title}>Join This Project</h2>
							<hr />
							<Redeem type="request" requestInvite={this.requestInvite.bind(this)} />
						</div>
					}
				</div>
			)
		}
		else if (selected == 'Collaborators'){
			const members = (project) ? this.props.profiles[project.id] : []
			content = (
				<div>
					<div className="col_two_third">
						<div className="feature-box center media-box fbox-bg">
							<div style={styles.main}>
								{ (isCollaborator) ? <a href="#" onClick={this.toggleInvite.bind(this)} style={{float:'right', marginTop:0}} className={localStyle.btnSmall.className}>Invite Collaborator</a> : null }
								<h2 style={styles.team.title}>Collaborators</h2>
								<hr />
								<Profiles memberFound={this.memberFound.bind(this)} toggleInvite={this.toggleInvite.bind(this)} members={members} user={user} />
							</div>
						</div>
					</div>

					{ (isCollaborator) ? null : 
						<div className="col_one_third col_last">
							<h2 style={style.title}>Join This Project</h2>
							<hr />
							<Redeem type="request" requestInvite={this.requestInvite.bind(this)} />
						</div>
					}
				</div>
			)
		}

		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								<div style={{paddingTop:96}}>
									{ (project == null) ? null : 
										<div>
											<img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginTop:6}} src={project.image+'=s140-c'} />
											<h2 style={ style.title }>{ project.title }</h2>
										</div>
									}
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
							{ content }

						</div>
					</section>

				</div>

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<h3 style={style.title}>{ TextUtils.capitalize(project.type) }</h3>
						</div>

						{ (author == null) ? null : 
							<div style={{textAlign:'right'}} className="col-xs-6">
								{ (author.image.length == 0) ? null : <img style={{float:'right', borderRadius:24, marginLeft:12}} src={author.image+'=s48-c'} /> }
								<Link to={'/profile/'+author.slug}>
									<h3 style={style.title}>{ author.username }</h3>
								</Link>
								<span style={styles.paragraph}>{ TextUtils.capitalize(author.location.city) }</span>
							</div>
						}
					</div>

					<div style={{padding:'0px 16px 16px 16px'}}>
						{ content }
					</div>

					{ (project.type == 'hiring') ? null : 
						<div style={{paddingBottom:24, background:'#f9f9f9', textAlign:'right'}}>
							<input type="text" id="text" onChange={this.updateComment.bind(this)} style={localStyle.input} placeholder="Enter Comment" />
							<br />
							<a href="#" onClick={this.submitComment.bind(this)} style={{marginTop:12, marginRight:16}} className="button button-mini button-circle button-green">Submit Comment</a>
						</div>
					}
				</div>
				{ /* end mobile UI */ }

				<Modal 
					title="Invite Collaborator"
					show={this.state.showInvite}
					toggle={this.toggleInvite.bind(this)}
					update={this.updateInvitation.bind(this)}
					submit={this.inviteCollaborator.bind(this)} />

			</div>
		)
	}
}

const localStyle = {
	input: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 0,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	image: {
		float:'left',
		marginRight:12,
		borderRadius:22,
		width:44
	},
	menuItem: {
		padding: '6px 6px 6px 16px',
		background: '#f9f9f9',
		borderLeft: '3px solid #ddd',
		fontSize: 16,
		fontWeight: 100
	},
	selected: {
		padding: '6px 6px 6px 16px',
		background: '#fff',
		borderRadius: 2,
		borderLeft: '3px solid rgb(91, 192, 222)',
		fontSize: 16,
		fontWeight: 400
	},
	btnSmall: {
		float: 'right',
		marginTop: 0,
		className: 'button button-small button-border button-border-thin button-blue'
	}	
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		projects: state.project,
		teams: state.team,
		profiles: state.profile,
		session: state.session,
		milestones: state.milestone
	}
}

const dispatchToProps = (dispatch) => {
	return {
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		fetchProfile: (id) => dispatch(actions.fetchProfile(id)),
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params)),
		fetchProjects: (params) => dispatch(actions.fetchProjects(params)),
		fetchComments: (params) => dispatch(actions.fetchComments(params)),
		createComment: (comment) => dispatch(actions.createComment(comment)),
		sendInvitation: (params) => dispatch(actions.sendInvitation(params)),
		createMilestone: (params) => dispatch(actions.createMilestone(params)),
		fetchMilestones: (params) => dispatch(actions.fetchMilestones(params)),
		requestInvitation: (invitation) => dispatch(actions.requestInvitation(invitation))
	}
}

export default connect(stateToProps, dispatchToProps)(ProjectDetail)
