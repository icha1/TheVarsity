import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { APIManager } from '../../utils'
import { PostFeed, TeamFeed, Comment } from '../view'
import styles from './styles'

class ProfileDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Feed',
			menuItems: [
				'Feed',
				'Teams',
				'Direct Message'
			]
		}
	}

	componentDidMount(){
		const profile = this.props.profiles[this.props.slug]
		if (profile){
			document.title = 'The Varsity | '+profile.username
			return
		}

		this.props.fetchProfile(this.props.slug)
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)
		this.setState({
			selected: item
		})
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

			this.props.fetchProfileTeams(profile)
		}

		if (selected == 'Direct Message'){
			if (this.props.user == null){
				alert('Please log in or register to send a direct message.')
				return
			}

			let profileIds = [profile.id, this.props.user.id].sort()
			let threadId = profileIds.join().replace(',', '') // alphabetize so the ID is the same for both participants
			console.log('Direct Message: '+threadId)

		}
	}

	render(){
		const style = styles.post
		const profile = this.props.profiles[this.props.slug] // can be null
		const selected = this.state.selected

		let username = null
		let image = null
		if (profile != null){
			username = profile.username
			image = <img style={{padding:3, border:'1px solid #ddd'}} src={profile.image+'=s140'} />
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
		
		if (selected == 'Feed' && profile != null)
			content = (this.props.posts[profile.id]) ? <PostFeed posts={this.props.posts[profile.id]} user={currentUser} /> : null
		
		if (selected == 'Teams' && profile != null)
			content = (this.props.teams[profile.id]) ? <TeamFeed teams={this.props.teams[profile.id]} user={currentUser} /> : null
		

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>
								{ image }
								<h2 style={style.title}>
									{ username }
								</h2>
								<hr />
								<nav id="primary-menu">
									<ul>{sideMenu}</ul>
								</nav>

							</div>
			            </div>

		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">

						<div className="col_two_third col_last">
							<h2 style={style.title}>
								{ this.state.selected }
							</h2>

							{ content }
						</div>

						<div className="col_one_third col_last">
							Right Side
						</div>

					</div>

				</section>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		profiles: state.profile.map,
		posts: state.profile.posts,
		teams: state.profile.teams,
		user: state.account.currentUser,
		session: state.session
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchProfile: (username) => dispatch(actions.fetchProfile(username)),
		fetchSavedPosts: (profile) => dispatch(actions.fetchSavedPosts(profile)),
		fetchProfileTeams: (profile) => dispatch(actions.fetchProfileTeams(profile))
	}
}

export default connect(stateToProps, mapDispatchToProps)(ProfileDetail)
