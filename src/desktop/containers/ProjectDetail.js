import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import actions from '../../actions/actions'
import constants from '../../constants/constants'
import { CreateComment, CreatePost, Comments, ProfilePreview, Application, Milestone, Profiles, Modal } from '../view'
import { DateUtils, FirebaseManager, TextUtils, APIManager, Alert } from '../../utils'
import styles from './styles'
import { Link } from 'react-router'
import Section from './Section'

class ProjectDetail extends Component {
	constructor(){
		super()
		this.state = {
			showInvite: false,
			timestamp: null,
			isEditing: false,
			comments: null,
			selected: 'Post',
			menuItems: ['Post', 'Comments', 'Collaborators'],
			invitation: {
				name: '',
				email: ''
			}
		}
	}

	componentWillMount(){
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		if (this.state.comments == null){
			this.props.fetchComments({'thread.id':post.id})
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

		// sloppy workaround, render timestamp client side:
		this.setState({timestamp: DateUtils.formattedDate(post.timestamp)})
	}

	componentDidUpdate(){
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		const author = this.props.profiles[post.author.slug]
		if (author == null)
			return

		const team = this.props.teams[post.teams[0]]
		if (team == null){
			this.props.fetchTeam(post.teams[0])
			return			
		}

		const selected = this.state.selected
		if (selected != 'Collaborators')
			return

		if (this.props.profiles[post.id] != null)
			return

		this.props.fetchProfiles({projects: post.id})
		.then(response => {})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
		})
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

		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		const user = this.props.user
		if (user == null)
			return

		let comment = {text: event.target.value}
		comment['thread'] = {
			id: post.id,
			schema: post.schema,
			subject: post.title,
			image: post.image
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

	updatePost(post){
		if (this.state.isEditing == false)
			return

		let updated = Object.assign({}, post)
		const original = this.props.posts[this.props.slug]
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

		const post = this.props.posts[this.props.slug]
//		const team = this.props.teams[this.props.slug]
		updated['context'] = {
			type: 'project',
			id: post.id,
			name: post.title,
			image: post.image,
			slug: post.slug
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

	render(){
		const style = styles.post
		const user = this.props.user // can be null
		const post = this.props.posts[this.props.slug]
		const author = (post == null) ? null : this.props.profiles[post.author.slug]

		let content = null
		const btn = 'button button-mini button-circle '
		const btnBlueClass = btn + 'button-blue'

		const selected = this.state.selected

		if (this.state.isEditing == true)
			content = <CreatePost submit={this.updatePost.bind(this)} cancel={this.toggleEditing.bind(this)} post={post} />		
		else if (selected == 'Post'){
			let btnEdit = null
			if (user != null){
				if (user.id == post.author.id)
					btnEdit = <button onClick={this.toggleEditing.bind(this)} className={btnBlueClass} style={{float:'right'}}>Edit</button>
			}

			content = (
				<div className="postcontent nobottommargin col_last clearfix">
					<div id="posts" className="post-timeline clearfix">
						<div className="timeline-border"></div>

						<div className="entry clearfix" style={{border:'none', paddingBottom:0}}>
							<div className="entry-timeline">
								1<span>Intro</span>
								<div className="timeline-divider"></div>
							</div>
							<div className="entry-image">
								<a href={post.image+'=s1024'} data-lightbox="image">
									<img style={{maxWidth:360, border:'1px solid #ddd', background:'#fff', padding:6}} className="image_fade" src={post.image} alt="The Varsity" />
								</a>
							</div>

							<ul className="entry-meta clearfix">
								{ post.images.map((image, i) => {
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

							<div className="clearfix"></div>
							<div className="entry-title clearfix">
								<h2 style={styles.team.title}>{post.title}</h2>
							</div>

							<hr />
							<div className="hidden-xs" style={{lineHeight:18+'px'}}>
								<img style={{marginRight:10, borderRadius:22, float:'left'}} src={post.author.image+'=s44-c'} />
								<span><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span><br />
								<span style={{fontWeight:100, fontSize:11}}>{ this.state.timestamp }</span><br />
							</div>

							<div className="entry-content" style={{marginTop:24}}>
								<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(post.text)}}></p>
							</div>
						</div>

						<div className="entry clearfix" style={{border:'none', marginBottom:12, paddingBottom:12, maxWidth:560}}>
							<div className="entry-timeline">
								+<span>Add</span>
								<div className="timeline-divider"></div>
							</div>
							<div className="entry-image">
								<div className="panel panel-default">
									<div className="panel-body">
										<input placeholder="Title" style={{width:100+'%', border:'none', background:'#f9f9f9', padding:6}} type="text" />
										<textarea placeholder="Describe your milestone" style={{width:100+'%', height:80, border:'none', background:'#f9f9f9', padding:6, marginTop:12}}></textarea>
										<div style={{textAlign:'right', marginTop:12}}>
											<button className="button button-small button-border button-border-thin button-blue">Add Milestone</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<Milestone />
						<Milestone />
						<Milestone />
						<Milestone />
					</div>
				</div>


			)
		}
		else if (selected == 'Comments'){
			content = (
				<div>
					<div className="col_two_third">
						<div className="feature-box center media-box fbox-bg">
							<div style={styles.main}>
								<h2 style={styles.team.title}>Comments</h2>
								<hr />
								<Comments 
									user={user}
									comments={this.state.comments}
									submitComment={this.submitComment.bind(this)} />
							</div>
						</div>
					</div>

					<div className="col_one_third col_last">

					</div>
				</div>
			)
		}
		else if (selected == 'Collaborators'){
			const members = (post) ? this.props.profiles[post.id] : []
			content = (
				<div>
					<div className="col_two_third">
						<div className="feature-box center media-box fbox-bg">
							<div style={styles.main}>
								{ (user==null) ? null : <a href="#" onClick={this.toggleInvite.bind(this)} style={{float:'right', marginTop:0}} className={localStyle.btnSmall.className}>Invite Collaborator</a> }
								<h2 style={styles.team.title}>Collaborators</h2>
								<hr />
								<Profiles memberFound={this.memberFound.bind(this)} toggleInvite={this.toggleInvite.bind(this)} members={members} user={user} />
							</div>
						</div>
					</div>

					<div className="col_one_third col_last">

					</div>
				</div>
			)
		}

		const team = (this.props.session.currentTeam) ? this.props.session.currentTeam : this.props.teams[post.teams[0]]
		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								<div style={{paddingTop:96}}>
									{ (team == null) ? null : 
										<div>
											<Link to={'/team/'+team.slug}>
												<img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginTop:6}} src={team.image+'=s140-c'} />
												<h2 style={ style.title }>{ team.name }</h2>
											</Link>
											<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span><br />
											<br />
											<Link to={'/team/'+team.slug}  href="#" className="button button-mini button-border button-border-thin button-blue" style={{marginLeft:0}}>View Team</Link>
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
							<h3 style={style.title}>{ TextUtils.capitalize(post.type) }</h3>
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

					{ (post.type == 'hiring') ? null : 
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
		float:'right',
		marginTop:0,
		className: 'button button-small button-border button-border-thin button-blue'
	}	
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		posts: state.post,
		teams: state.team,
		profiles: state.profile,
		session: state.session
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchPostById: (id) => dispatch(actions.fetchPostById(id)),
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		fetchProfile: (id) => dispatch(actions.fetchProfile(id)),
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		fetchTeam: (id) => dispatch(actions.fetchTeam(id)),
		fetchComments: (params) => dispatch(actions.fetchComments(params)),
		createComment: (comment) => dispatch(actions.createComment(comment)),
		sendInvitation: (params) => dispatch(actions.sendInvitation(params))
	}
}

export default connect(stateToProps, dispatchToProps)(ProjectDetail)
