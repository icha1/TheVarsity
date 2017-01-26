import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { CreatePost, CreateProject, ProfilePreview, PostFeed, Comment, TeamInfo, Sidebar, Profiles, Chat, Modal, Explanation } from '../view'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { TextUtils, APIManager, FirebaseManager, Alert } from '../../utils'
import actions from '../../actions/actions'
import styles from './styles'

class TeamDetail extends Component {
	constructor(){
		super()
		this.memberFound = this.memberFound.bind(this)
		this.inviteMember = this.inviteMember.bind(this)
		this.state = {
			showInvite: false,
			showSubmit: false,
			showCreateProject: false,
			invitation: {
				name: '',
				email: ''
			},
			menuItems: [
				'Projects',
				'Hiring',
				'Chat',
				'Members'
			],
			comments: [],
			firebaseConnected: false
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const team = this.props.teams[this.props.slug]
		if (team != null){
			this.props.setCurrentTeam(team)
			if (this.props.posts[team.id] == null)
				this.props.fetchPosts({teams: team.id})

			return
		}

		this.props.fetchTeams({slug: this.props.slug})
		.then(results => {
			if (results.length == 0)
				return

		})
		.catch(err => {
			console.log('ERROR:' + err)
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

	connectToFirebase(){
		if (this.state.firebaseConnected)
			return

		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		FirebaseManager.register('/'+team.id+'/chat', (err, currentComments) => {
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

		const selected = (item.length == 0) ? event.target.value : item
		this.props.selectedFeedChanged({
			page: 'team',
			selected: selected
		})
	}

	updateInvitation(event){
		let updated = Object.assign({}, this.state.invitation)
		updated[event.target.id] = event.target.value
		this.setState({
			invitation: updated
		})
	}

	inviteMember(event){
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

		const team = this.props.teams[this.props.slug]
		updated['team'] = {
			id: team.id,
			name: team.name,
			image: team.image
		}

		updated['code'] = TextUtils.randomString(6)

		this.setState({showInvite: false})
		this.props.sendInvitation(updated)
		.then((response) => {
			Alert.showConfirmation({
				title: 'Invitation Sent!',
				text: 'Thanks for inviting your friend to The Varsity.'
			})
		})
		.catch((err) => {
//			console.log('ERROR: '+JSON.stringify(err))
			Alert.showAlert({
				title: 'Error',
				text: err.message || err
			})
		})
	}

	requestInvitation(invitation){
		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		console.log('requestInvitation: '+JSON.stringify(invitation))
		let updated = Object.assign({}, invitation)
		updated['team'] = {
			image: team.image,
			name: team.name,
			id: team.id
		}

		updated['code'] = TextUtils.randomString(6)
		return this.props.requestInvitation(updated)
	}

	keyPress(action, event){
		if (event.charCode != 13)
			return

		if (action == 'invite')
			this.inviteMember()
	}

	toggleInvite(event){
		if (event)
			event.preventDefault()

		this.setState({
			showInvite: !this.state.showInvite
		})
	}

	toggleShowSubmit(event){
		event.preventDefault()
		this.setState({
			showSubmit: !this.state.showSubmit
		})
	}

	createProject(event){
		event.preventDefault()
		this.setState({
			showCreateProject: !this.state.showCreateProject
		})
	}

	updateTeam(updated){
		const team = this.props.teams[this.props.slug]
		return this.props.updateTeam(team, updated)
	}

	submitPost(post){
		const user = this.props.user
		post['saved'] = [user.id]
		post['type'] = (post.type) ? post.type : this.props.selected.toLowerCase()
		post['author'] = {
			id: user.id,
			name: user.username,
			slug: user.slug,
			image: (user.image.length == 0) ? null : user.image,
			type: 'profile'
		}

		const team = this.props.teams[this.props.slug]
		post['teams'] = [team.id]

		// find and remove any email strings:
		post['contact'] = TextUtils.findEmails(post.text)
		if (post.contact.length > 0){
			let text = post.text
			post.contact.forEach((email, i) => {
				text = text.replace(email, '')
			})
			post['text'] = text
		}

		this.props.createPost(post)
		.then(response => {
			browserHistory.push('/post/'+response.result.slug)
			return response
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

	voteOnPost(post, upOrDown){
		const user = this.props.user
		if (user == null)
			return

		this.props.fetchPostById(post.id)
		.then(result => {
			let votes = result.votes
			const arrayKey = (upOrDown == 'up') ? 'upvotes' : 'downvotes'
			let array = votes[arrayKey]

			let isFound = false
			array.every((voter, i) => {
				if (voter.id == user.id){
					isFound = true
					return false					
				}

				return true
			})

			if (isFound)
				return

			array.push({
				id: user.id,
				username: user.username,
				image: user.image
			})

			votes[arrayKey] = array

			votes['score'] = (votes.upvotes.length-votes.downvotes.length)
			result['votes'] = votes
			return this.props.updatePost(result, {votes: votes})
		})
		.then(result => {
//			console.log('UPDATE POST: '+JSON.stringify(result))

		})
		.catch(err => {
			console.log('ERR: '+err.message)
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

	submitComment(event){
		if (event.charCode != 13)
			return

		const profile = this.props.user
		if (profile == null){
			alert('Please Log In or Register')
			return
		}

		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		if (event.target.value.length == 0){
			alert('Please enter a comment')
			return
		}

		let comment = {text: event.target.value}
		comment['team'] = team.id
		const timestamp = Date.now()
		comment['timestamp'] = timestamp
		comment['id'] = Math.floor(timestamp/1000)
		comment['profile'] = {
			id: profile.id,
			username: profile.username,
			slug: profile.slug,
			image: profile.image
		}

		event.persist()
		const path = '/'+team.id+'/chat/'+this.state.comments.length
		FirebaseManager.post(path, comment, () => {
			event.target.value = ''
			event.target.blur()
		})
	}

	componentDidUpdate(){
		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		if (this.props.session.currentTeam == null)
			this.props.setCurrentTeam(team)

		const selected = this.props.session.selected.team
		if (selected == 'Members'){
			if (this.props.profiles[team.id] == null)
				this.props.fetchProfiles({teams: team.id})
		}

		else if (selected == 'Chat'){
			if (this.state.firebaseConnected == false)
				this.connectToFirebase()
		}
		else if (this.props.posts[team.id] == null)
			this.props.fetchPosts({teams: team.id})
	}

	sublist(selected){
		const team = this.props.teams[this.props.slug]
		if (team == null)
			return []

		const filter = (selected == 'Projects') ? 'project' : selected // project is singular in post schema
		const list = (this.props.posts[team.id] == null) ? [] : this.props.posts[team.id]
		const sublist = list.filter((post, i) => {
			return (post.type == filter.toLowerCase())
		})

		return sublist
	}


	render(){
		const team = this.props.teams[this.props.slug]
		if (team == null){
			return (<div></div>) // blank while team fetches
		}

		const style = styles.team
		let content = null
		let cta = null

		const selected = this.props.session.selected.team
		if (selected == 'Hiring'){
			cta = (this.props.user == null) ? null : <a href="#" onClick={this.toggleShowSubmit.bind(this)} style={localStyle.btnSmall} className={localStyle.btnSmall.className}>{ (this.state.showSubmit) ? 'Cancel' : 'Submit Post'}</a>
			const sublist = this.sublist(selected)
			content = (
				<div>
					{ (this.props.user != null) ? 
						<div className="hidden-xs">
							{ (this.state.showSubmit) ? <CreatePost submit={this.submitPost.bind(this)} /> : null }
						</div>
						:
						<div className="alert alert-success">
						  <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
						  <i className="icon-gift"></i>Please log in to submit a post.
						</div>						
					}

					<PostFeed 
						posts={sublist}
						deletePost={this.deletePost.bind(this)}
						vote={this.voteOnPost.bind(this)}
						user={this.props.user} />
				</div>
			)
		}
		else if (selected == 'Projects'){
			cta = (this.props.user == null) ? null : <a href="#" onClick={this.createProject.bind(this)} style={localStyle.btnSmall} className={localStyle.btnSmall.className}>Showcase Your Work</a>
			const sublist = this.sublist(selected)
			content = (this.state.showCreateProject) ? <CreateProject team={team} onCreate={this.submitPost.bind(this)} /> : (
				<div>
					{ (sublist.length == 0) ? <Explanation context={selected} btnAction={this.toggleInvite.bind(this)} /> : 
						<PostFeed 
							posts={sublist}
							deletePost={this.deletePost.bind(this)}
							vote={this.voteOnPost.bind(this)}
							user={this.props.user} />
					}
				</div>
			)
		}
		else if (selected == 'Overview'){
			content = (
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
			)
		}
		else if (selected == 'Members'){
			cta = (this.props.user==null) ? null : <a href="#" onClick={this.toggleInvite.bind(this)} style={{float:'right', marginTop:0}} className={localStyle.btnSmall.className}>Invite Member</a>
			const members = this.props.profiles[team.id]
			content = <Profiles memberFound={this.memberFound.bind(this)} toggleInvite={this.toggleInvite.bind(this)} members={members} team={team} user={this.props.user} />
		}
		else if (selected == 'Chat')
			content = <Chat user={this.props.user} comments={this.state.comments} keyPress={this.submitComment.bind(this)} />

		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#fff', border:'none'}}>
						<Sidebar 
							badge={{chats: 1}}
							padding={true}
							menuItems={this.state.menuItems}
							selectItem={this.selectItem.bind(this)}
							selected={this.props.selected}
							{...team} />
					</header>

					<section id="content" style={{background:'#fff', minHeight:800}}>
						<div className="content-wrap container clearfix">
							<div className="col_two_third">
								<div className="feature-box center media-box fbox-bg" style={{padding:24}}>
									<div style={{marginBottom:24, textAlign:'left'}}>
										{ cta }
										<h2 style={style.title}>{selected}</h2>
									</div>

									{ content }
								</div>
							</div>

							<div className="col_one_third col_last">
								<TeamInfo
									team={team}
									user={this.props.user} // can be null
									onUpdate={this.updateTeam.bind(this)}
									onSubmitInvitation={this.requestInvitation.bind(this)} />
							</div>
						</div>
					</section>
				</div>

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<select onChange={this.selectItem.bind(this, '')} style={localStyle.select} id="select">
								<option value="Projects">Projects</option>
								<option value="Hiring">Hiring</option>
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

					<div style={{marginTop:24}}>
						{ content }
					</div>
				</div>
				{ /* end mobile UI */ }

				<Modal 
					title="Invite Member"
					show={this.state.showInvite}
					toggle={this.toggleInvite.bind(this)}
					update={this.updateInvitation.bind(this)}
					submit={this.inviteMember.bind(this)} />
			</div>
		)
	}
}

const localStyle = {
	btnBlue: {
		className: 'button button-small button-circle button-blue'
	},
	btnSmall: {
		float:'right',
		marginTop:0,
		className: 'button button-small button-border button-border-thin button-blue'
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
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		teams: state.team,
		posts: state.post,
		profiles: state.profile,
		selected: state.session.selected,
		session: state.session
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		fetchPostById: (id) => dispatch(actions.fetchPostById(id)),
		updateTeam: (team, params) => dispatch(actions.updateTeam(team, params)),
		requestInvitation: (params) => dispatch(actions.requestInvitation(params)),
		sendInvitation: (params) => dispatch(actions.sendInvitation(params)),
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		createPost: (params) => dispatch(actions.createPost(params)),
		selectedFeedChanged: (selected) => dispatch(actions.selectedFeedChanged(selected)),
		setCurrentTeam: (team) => dispatch(actions.setCurrentTeam(team))
	}
}

export default connect(stateToProps, dispatchToProps)(TeamDetail)
