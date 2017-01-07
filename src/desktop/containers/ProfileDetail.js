import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { APIManager, FirebaseManager, TextUtils } from '../../utils'
import { PostFeed, TeamFeed, Comment, CreateComment, EditProfile } from '../view'
import styles from './styles'

class ProfileDetail extends Component {
	constructor(){
		super()
		this.state = {
			showEdit: false,
			selected: 'Overview',
			comments: null,
			menuItems: [
				'Overview',
				'Feed',
				'Teams',
				'Direct Message'
			]
		}
	}

	componentDidMount(){
//		console.log('componentDidMount: ')
		const profile = this.props.profiles[this.props.slug]
		if (profile == null){
			this.props.fetchProfiles({slug: this.props.slug})
			return
		}

		document.title = 'The Varsity | '+profile.username
	}

	componentDidUpdate(){
		const profile = this.props.profiles[this.props.slug]
		if (profile == null)
			return

		const selected = this.state.selected
		if (selected == 'Feed'){ // these are posts that the profile saved
			if (this.props.posts[profile.id])
				return

//			console.log('Fetch Posts')
			this.props.fetchSavedPosts(profile)
		}

		if (selected == 'Teams'){
			if (this.props.teams[profile.id])
				return

			this.props.fetchTeams({'members.id':profile.id})
		}

		if (selected == 'Direct Message'){
			if (this.props.user == null){
				alert('Please log in or register to send a direct message.')
				return
			}

			if (this.state.comments) // comments already loaded
				return

			let profileIds = [profile.id, this.props.user.id].sort()
			let threadId = profileIds.join().replace(',', '') // alphabetize so the ID is the same for both participants
			FirebaseManager.register('/'+threadId+'/comments', (err, currentComments) => {
				let comments = (err) ? [] : currentComments.reverse()
				this.setState({
					comments: comments
				})
			})
		}
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)
		this.setState({
			selected: item,
			showEdit: false
		})
	}

	submitComment(comment){
		if (this.props.user == null){
			alert('Please log in or register to post a comment.')
			return
		}

		let updated = Object.assign({}, comment)
		updated['timestamp'] = new Date().getTime()
		updated['profile'] = {
			id: this.props.user.id,
			username: this.props.user.username,
			image: this.props.user.image
		}

		const profile = this.props.profiles[this.props.slug]
		if (profile == null)
			return

		let profileIds = [profile.id, this.props.user.id].sort()
		let threadId = profileIds.join().replace(',', '') // alphabetize so the ID is the same for both participants

		const path = '/'+threadId+'/comments/'+this.state.comments.length
		FirebaseManager.post(path, updated, () => {
//			this.props.updatePost(post, {numComments: this.state.comments.length})
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
		const profile = this.props.profiles[this.props.slug] // can be null
		if (profile == null)
			return

//		console.log('UPDATE: '+JSON.stringify(updated))
		this.props.updateProfile(profile, updated)
		this.setState({
			showEdit: !this.state.showEdit
		})

	}

	render(){
		const style = styles.post
		const profile = this.props.profiles[this.props.slug] // can be null
		const selected = this.state.selected

		let username = null
		let image = null
		if (profile != null){
			username = profile.username
			image = (profile.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd'}} src={profile.image+'=s140-c'} />
		}


		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (item == selected) ? styles.team.selected : styles.team.menuItem
			return (
				<li key={i}>
					<div style={itemStyle}>
						<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
					</div>
				</li>
			)
		})

		let content = null
		const currentUser = this.props.user // can be null

		if (this.state.showEdit){
			let btnEdit = null
			if (currentUser != null){
				if (currentUser.id == profile.id)
					btnEdit = <button onClick={this.editProfile.bind(this)} style={{float:'right'}}>Done</button>
			}

			content = <EditProfile profile={currentUser} update={this.updateProfile.bind(this)} close={this.editProfile.bind(this)} />
		}
		
		else if (selected == 'Overview' && profile != null){
			let btnEdit = null
			if (currentUser != null){
				if (currentUser.id == profile.id)
					btnEdit = <button onClick={this.editProfile.bind(this)} style={{float:'right'}}>Edit</button>
			}

			content = (
				<div className="feature-box center media-box fbox-bg">
					<div style={styles.main}>
						{ btnEdit }
						<h2 style={styles.post.title}>Overview</h2>
						<hr />
						<h4 style={styles.header}>{ profile.title }</h4>
						<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(profile.bio)}}></p>
					</div>
				</div>
			)
		}

		else if (selected == 'Feed' && profile != null)
			content = (this.props.posts[profile.id]) ? <PostFeed posts={this.props.posts[profile.id]} user={currentUser} /> : null
		
		else if (selected == 'Teams' && profile != null)
			content = (this.props.teams[profile.id]) ? <TeamFeed teams={this.props.teams[profile.id]} user={currentUser} /> : null
		
		else if (selected == 'Direct Message' && profile != null){
			content = (
				<div style={{overflowY:'scroll', borderRight:'1px solid #ddd', borderLeft:'1px solid #ddd', borderBottom:'1px solid #ddd'}}>
					<CreateComment onCreate={this.submitComment.bind(this)} />
					{ (this.state.comments) ? this.state.comments.map((comment, i) => {
							return <Comment comment={comment} key={i} />
						}) : null
					}
				</div>
			)
		}

		return (
			<div className="clearfix">
				<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>
								{ image }
								<h2 style={style.title}>{ username }</h2>
								<hr />
								<nav id="primary-menu">
									<ul>{sideMenu}</ul>
								</nav>
								
								<div className="clearfix visible-md visible-lg">
									<a href="#" className="social-icon si-small si-borderless si-facebook">
										<i className="icon-facebook"></i>
										<i className="icon-facebook"></i>
									</a>

									<a href="#" className="social-icon si-small si-borderless si-instagram">
										<i className="icon-instagram"></i>
										<i className="icon-instagram"></i>
									</a>
								</div>

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
							<h3 style={styles.team.title}>Accept Invitation</h3>
							<hr style={{marginBottom:0}} />

							<input style={localStyle.input} type="text" placeholder="Email" />
							<input style={localStyle.input} type="text" placeholder="Invite Code" />
				            <a href="#" className="button button-circle" style={localStyle.btnBlue}>Submit</a>
						</div>

					</div>

				</section>
			</div>
		)
	}
}

const localStyle = {
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
	btnBlue: {
		backgroundColor:'rgb(91, 192, 222)'
	}
}
const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		profiles: state.profile,
		posts: state.profile.posts,
		teams: state.team,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params)),
		fetchSavedPosts: (profile) => dispatch(actions.fetchSavedPosts(profile)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		updateProfile: (profile, params) => dispatch(actions.updateProfile(profile, params))
	}
}

export default connect(stateToProps, mapDispatchToProps)(ProfileDetail)
