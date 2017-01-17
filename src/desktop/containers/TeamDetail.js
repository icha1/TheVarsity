import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { Modal } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { CreatePost, ProfilePreview, PostFeed, Comment, TeamInfo, Sidebar } from '../view'
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
			showInvite: false,
			invitation: {
				name: '',
				email: ''
			},
			menuItems: [
				'All',
				'News',
				'Hiring',
				'Showcase',
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
		if (team != null){
			if (this.state.selected == 'All'){
				if (this.props.posts[team.id] == null)
					this.props.fetchPosts({teams: team.id})
			}

			return
		}

		this.props.fetchTeams({slug: this.props.slug})
		.then(results => {
			if (results.length == 0)
				return

			// this.connectToFirebase()
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

	requestInvitation(invitation){
//		event.preventDefault()
		console.log('requestInvitation: '+JSON.stringify(invitation))

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

	updateTeam(updated){
//		console.log('UPDATE TEAM: '+JSON.stringify(updated))
		const team = this.props.teams[this.props.slug]
		return this.props.updateTeam(team, updated)
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

		if (selected == 'All' || selected == 'News' || selected == 'Hiring' || selected == 'Showcase'){
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

					{ (list == null) ? null : 
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
					<div style={{overflowY:'scroll', maxHeight:360, background:'#FCFDFF', padding:0}}>
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
						<Sidebar 
							menuItems={this.state.menuItems}
							selectItem={this.selectItem.bind(this)}
							selected={this.state.selected}
							{...team} />
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
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
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
		fetchPostById: (id) => dispatch(actions.fetchPostById(id)),
		updateTeam: (team, params) => dispatch(actions.updateTeam(team, params)),
		sendInvitation: (params) => dispatch(actions.sendInvitation(params)),
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		createPost: (params) => dispatch(actions.createPost(params))
	}
}

export default connect(stateToProps, dispatchToProps)(TeamDetail)
