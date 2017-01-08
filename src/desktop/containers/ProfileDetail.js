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
			this.props.fetchPosts({saved:profile.id})
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
			showEdit: false,
			selected: (event.target.id == 'select') ? event.target.value : item
		})

		// event.preventDefault()
		// window.scrollTo(0, 0)
		// this.setState({
		// 	selected: item,
		// 	showEdit: false
		// })
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
		let btnEdit = null
		const currentUser = this.props.user // can be null

		if (this.state.showEdit){
			if (currentUser != null){
				if (currentUser.id == profile.id)
					btnEdit = <button onClick={this.editProfile.bind(this)} style={{float:'right'}}>Done</button>
			}

			content = <EditProfile profile={currentUser} update={this.updateProfile.bind(this)} close={this.editProfile.bind(this)} />
		}
		
		else if (selected == 'Overview' && profile != null){
			if (currentUser != null){
				if (currentUser.id == profile.id)
					btnEdit = <button onClick={this.editProfile.bind(this)} style={{float:'right'}}>Edit</button>
			}

			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					<div className="hidden-xs">
						<h4 style={styles.header}>{ profile.title }</h4>
						<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(profile.bio)}}></p>
					</div>

					{ /* mobile UI*/ }
					<div className="visible-xs" style={{padding:'0px 24px 0px 24px'}}>
						{ (profile.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginBottom:12}} src={profile.image+'=s160-c'} /> }
						<h4 style={styles.header}>{ profile.title }</h4>
						<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(profile.bio)}}></p>
					</div>
				</div>
			)
		}

		else if (selected == 'Feed' && profile != null){
			let feed = (this.props.posts[profile.id]) ? <PostFeed posts={this.props.posts[profile.id]} user={currentUser} /> : null
			content = (
				<div style={{textAlign:'left', marginTop:24}}>
					<div className="hidden-xs">
						{feed}
					</div>

					{ /* mobile UI*/ }
					<div className="visible-xs" style={{padding:0}}>
						{feed}
					</div>
				</div>
			)

		}
		
		else if (selected == 'Teams' && profile != null){
			content = (this.props.teams[profile.id]) ? <TeamFeed teams={this.props.teams[profile.id]} user={currentUser} /> : null			
		}
		
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
			<div>
				<div className="clearfix hidden-xs">
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
										<h2 style={styles.team.title}>{this.state.selected}</h2>
										<hr />
										{ content }
									</div>
								</div>

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

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<select onChange={this.selectItem.bind(this, '')} style={localStyle.select} id="select">
								<option value="Overview">Overview</option>
								<option value="Feed">Feed</option>
								<option value="Teams">Teams</option>
								<option value="Direct Message">Direct Message</option>
							</select>
						</div>

						{ (profile == null) ? null : 
							<div style={{textAlign:'right'}} className="col-xs-6">
								{ (profile.image.length == 0) ? null : <img style={{float:'right', borderRadius:24, marginLeft:12}} src={profile.image+'=s48-c'} /> }
								<h3 style={style.title}>{ profile.username }</h3>
								<span style={styles.paragraph}>{ TextUtils.capitalize(profile.location.city) }</span>
							</div>							
						}
					</div>

					{ content }
				</div>
				{ /* end mobile UI */ }

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
	btnBlue: {
		backgroundColor:'rgb(91, 192, 222)'
	}
}
const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		profiles: state.profile,
		posts: state.post,
		teams: state.team,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params)),
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		updateProfile: (profile, params) => dispatch(actions.updateProfile(profile, params))
	}
}

export default connect(stateToProps, mapDispatchToProps)(ProfileDetail)
