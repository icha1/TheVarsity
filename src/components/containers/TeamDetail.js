import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CreateComment, Comment, ProfilePreview, PostFeed } from '../view'
import { TextUtils } from '../../utils'
import actions from '../../actions/actions'
import styles from './styles'

class TeamDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Overview',
			menuItems: [
				'Overview',
				'Posts',
				'Members',
				'Chat'
			]
		}
	}

	componentDidMount(){
		const team = this.props.teams[this.props.slug]

		// Track view count:
		const userId = (this.props.user == null) ? 'unregistered' : this.props.user.id
		let updatedViewed = Object.assign({}, team.viewed)
		updatedViewed[userId] = (updatedViewed[userId] == null) ? 1 : updatedViewed[userId]+1
		let total = 0
		Object.keys(updatedViewed).forEach((key, i) => {
			if (key != 'total')
				total += updatedViewed[key]
		})

		updatedViewed['total'] = total
		this.props.updateTeam(team, {viewed: updatedViewed})		
	}

	componentDidUpdate(){
		const team = this.props.teams[this.props.slug]
		if (team == null)
			return

		const selected = this.state.selected
		if (selected == 'Posts'){
			if (this.props.posts[team.id] == null)
				this.props.fetchTeamPosts(team)
		}
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)

		this.setState({
			selected: item
		})
	}

	render(){
		const team = this.props.teams[this.props.slug]
		const style = styles.team

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
		if (selected == 'Overview'){
			content = (
				<div className={styles.post.container.className} style={styles.post.container}>
					<h2 style={styles.post.title}>Overview</h2>
					<hr />
					<p dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
				</div>
			)			
		}


		if (selected == 'Posts'){
			const list = this.props.posts[team.id]
			content = (list) ? <PostFeed posts={list} user={this.props.user} /> : null
		}

		if (selected == 'Members'){
			content = (
				<div className="feature-box center media-box fbox-bg">
					<div className="fbox-desc">

						<div style={{textAlign:'left', padding:24, borderTop:'1px solid #ddd'}}>
							<h2 style={styles.post.title}>Members</h2>
						</div>

						<div style={{borderTop:'1px solid #ddd', textAlign:'left'}}>
								{
									team.members.map((member, i) => {
										return (
											<ProfilePreview key={member.id} profile={member} />
										)
									})
								}
						</div>

					</div>
				</div>
			)			
		}

		if (selected == 'Chat'){
			
		}

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>
								{ (team.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd'}} src={team.image+'=s140'} /> }
								<h2 style={style.title}>{ team.name }</h2>
								<div style={{padding:8, background:'#EBF5FB', border:'1px solid #ddd'}}>
									{ team.address.street }<br />
									{ (team.social.website) ? <div><a target="_blank" style={{color:'blue'}} href={team.social.website}>website</a></div> : null }
									{ this.props.session.currentDistrict.name }
								</div>

								<hr />
								<nav id="primary-menu">
									<ul>{sideMenu}</ul>
								</nav>

								{ (team.social.instagram == null) ? null : <a href={'/scrape?team='+team.id}>Scrape</a> }
							</div>
			            </div>

		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
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
		user: state.account.currentUser,
		session: state.session, // currentDistrict, currentLocation, teams, selectedFeed, reload
		teams: state.team.map,
		posts: state.team.posts
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchTeamPosts: (team) => dispatch(actions.fetchTeamPosts(team)),
		updateTeam: (team, params) => dispatch(actions.updateTeam(team, params))
	}
}

export default connect(stateToProps, dispatchToProps)(TeamDetail)
