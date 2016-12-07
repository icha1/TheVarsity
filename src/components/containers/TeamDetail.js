import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CreateComment, Comment, ProfilePreview, PostFeed } from '../view'
import { TextUtils, APIManager } from '../../utils'
import actions from '../../actions/actions'
import styles from './styles'

class TeamDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Overview',
			invited: '', // comma separated string
			menuItems: [
				'Overview',
				'Posts',
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

	subscribe(event){
		event.preventDefault()
		console.log('Subscribe')
	}

	invite(event){
		event.preventDefault()

		let array = []
		this.state.invited.split(',').forEach((email, i) => {
			let isValid = TextUtils.validateEmail(email.trim())
			if (isValid)
				array.push(email.trim())
		})

		if (array.length == 0){
			alert('Please add at least one valid email.')
			return
		}

		APIManager
		.handlePost('/account/invite', {invited: array})
		.then(response => {
//			console.log('INVITED: '+JSON.stringify(response))
			alert('Thanks for inviting members! They have been notified by email.')
		})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
			alert(err)
		})
	}

	updateInvited(event){
		event.preventDefault()
		this.setState({
			invited: event.target.value
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
				<div className="feature-box center media-box fbox-bg" style={{background:'url("'+team.image+'")', borderRadius:'5px 5px 8px 8px'}}>
					<div className="fbox-desc gradient">
						<div style={{textAlign:'left', padding:24, borderTop:'1px solid #ddd'}}>
							<h2 style={styles.team.titleWhite}>Overview</h2>
							<hr style={{marginBottom:4}} />
							<div style={{color:'#fff'}}>
								{ team.address.street }<br />
								{ (team.social.website) ? <div><a target="_blank" style={{color:'#fff'}} href={team.social.website}>website</a></div> : null }
								{ this.props.session.currentDistrict.name }
							</div>

						</div>

						<div style={{borderTop:'1px solid #ddd', textAlign:'left', padding:24, background:'#fff'}}>
							<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(team.description)}}></p>
						</div>

					</div>
				</div>
			)			
		}


		if (selected == 'Posts'){
			const list = this.props.posts[team.id]
			content = (list) ? <PostFeed posts={list} user={this.props.user} /> : null
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
								<a href="#" className="button button-border button-rounded button-blue"><i className="icon-bookmark2"></i>Subscribe</a>

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

						<div className="col_one_third col_last">
							<h3 style={styles.team.title}>Members</h3>
							<hr style={{marginBottom:0}} />
							{
								team.members.map((member, i) => {
									return (
										<ProfilePreview key={member.id} profile={member} />
									)
								})
							}

							<div style={{textAlign:'left', borderTop:'1px solid #eee', paddingTop:12, marginTop:24}}>
								<h4 style={styles.team.title}>Invite</h4>
								To invite members, add their emails above separated by commas.<br />
								<input onChange={this.updateInvited.bind(this)} type="text" placeholder="example@email.com, example2@email.com" style={{border:'none', background:'#fff', width:'100%', padding:8, marginTop:6, marginBottom:6}} />
								<button onClick={this.invite.bind(this)} style={{float:'right'}} className="button button-small button-circle button-blue">Invite</button>
							</div>

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
