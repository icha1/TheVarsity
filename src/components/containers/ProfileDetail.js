import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { APIManager } from '../../utils'
import { PostFeed, Comment } from '../view'
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
		this.setState({
			selected: item
		})
	}

	componentDidUpdate(){
		const profile = this.props.profiles[this.props.slug]
		if (profile == null)
			return

		console.log('ProfileDetail: componentDidUpdate - '+profile.username)

		const selected = this.state.selected
		if (selected == 'Feed'){ // these are posts that the profile saved
			if (this.props.posts[profile.id])
				return

			console.log('Fetch Posts')
			this.props.fetchSavedPosts(profile)
		}

		if (selected == 'Teams'){
			console.log('Fetch Teams')

		}

		if (selected == 'Direct Message'){
			console.log('Direct Message')

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
		if (selected == 'Feed' && profile != null)
			content = (this.props.posts[profile.id]) ? <PostFeed posts={this.props.posts[profile.id]} user={this.props.user} /> : null
		
		if (selected == 'Teams' && profile != null)
			content = 'Show Teams'

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

						<div className="col_full col_last">
							<h2 style={style.title}>
								{ this.state.selected }
							</h2>

							{ content }


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
		session: state.session

		// posts: state.post.map,
		// teams: state.team.map
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchProfile: (username) => dispatch(actions.fetchProfile(username)),
		fetchSavedPosts: (profile) => dispatch(actions.fetchSavedPosts(profile))
	}
}

export default connect(stateToProps, mapDispatchToProps)(ProfileDetail)
