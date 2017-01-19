import React, { Component } from 'react'
import { connect } from 'react-redux'
import { APIManager, DateUtils, TextUtils } from '../../utils'
import { Sidebar, PostFeed, CreatePost, CreateTeam, TeamFeed, Comment, CreateComment } from '../view'
import constants from '../../constants/constants'
import actions from '../../actions/actions'
import styles from './styles'
import { Link } from 'react-router'

class Feed extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Front Page',
			menuItems: ['Front Page', 'Saved']
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const user = this.props.user
		if (user == null)
			return

		const teamsString = user.teams.join(',')
		const posts = this.props.posts[teamsString]
		if (posts == null)
			this.props.fetchPosts({teams: teamsString, limit:10})
			.then(response => {
				return response
			})
			.catch(err => {

			})
		
		const teams = this.props.teams[user.id] // can be null
		if (teams == null){
			this.props.fetchTeams({'members.id': user.id})
			.then(response => {
				return response
			})
			.catch(err => {

			})
			
			return
		}

	}

	componentDidUpdate(){
		const selected = this.state.selected
		if (selected == 'Saved'){
			const posts = this.props.posts['saved'] // can be bull
			if (posts != null)
				return

			const user = this.props.user
			if (user == null)
				return

			this.props.fetchPosts({saved:user.id})
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
		const style = styles.post
		const user = this.props.user
		const teams = this.props.teams[user.id] // can be null
		const selected = this.state.selected

		let posts = null
		if (selected == 'Front Page'){
			const teamsString = user.teams.join(',')
			posts = this.props.posts[teamsString] // can be bull
		}

		if (selected == 'Saved'){
			posts = this.props.posts['saved'] // can be bull
		}

		return (
			<div className="clearfix hidden-xs">
				<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>
								{ (user == null) ? null : 
									<div>
										<img style={localStyle.profileImage} src={user.image+'=s140'} />
										<h2 style={ style.title }>
											<Link to={'/profile/'+user.slug}>{ user.username }</Link>
										</h2>
										<span style={styles.paragraph}>{ user.title }</span><br />
										<br />
										<Link to="/account"  href="#" className="button button-mini button-border button-border-thin button-blue" style={{marginLeft:0}}>Account</Link>
									</div>
								}

								<hr />
								<nav>
									<ul style={{listStyleType:'none'}}>
										{ this.state.menuItems.map((item, i) => {
												const itemStyle = (item == selected) ? localStyle.selected : localStyle.menuItem
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

				<section id="content" style={style.content}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
							<div className="feature-box center media-box fbox-bg" style={{padding:24, textAlign:'left'}}>
								{ (posts == null) ? null : 
									<PostFeed 
										posts={posts}
										deletePost={null}
										vote={null}
										user={user} />
								}

							</div>
						</div>

						<div className="col_one_third col_last">
							<h2 style={styles.title}>Your Teams</h2>
							<hr />
							<nav id="primary-menu">
								{ (teams == null) ? null : teams.map((team, i) => {
										return (
											<div key={team.id} style={{padding:'16px 16px 16px 0px'}}>
												<Link to={'/team/'+team.slug}>
													<img style={localStyle.image} src={team.image+'=s44-c'} />
												</Link>
												<Link style={localStyle.detailHeader} to={'/team/'+team.slug}>
													{team.name}
												</Link>
												<br />
												<span style={localStyle.subtext}>{ TextUtils.capitalize(team.type) }</span>
											</div>
										)
									})
								}
							</nav>

						</div>
					</div>
				</section>
			</div>
		)
	}
}

const localStyle = {
	profileImage: {
		padding:3,
		border:'1px solid #ddd',
		background:'#fff',
		marginTop:6
	},
	image: {
		float:'left',
		marginRight:12,
		borderRadius:22,
		width:44
	},
	detailHeader: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		fontSize: 18,
		lineHeight: 10+'px'
	},
	subtext: {
		fontWeight:100,
		fontSize:14,
		lineHeight:14+'px'
	},
	selected: {
		padding: '6px 6px 6px 16px',
		background: '#fff',
		borderRadius: 2,
		borderLeft: '3px solid rgb(91, 192, 222)',
		fontSize: 16,
		fontWeight: 400
	},
	menuItem: {
		padding: '6px 6px 6px 16px',
		background: '#f9f9f9',
		borderLeft: '3px solid #ddd',
		fontSize: 16,
		fontWeight: 100
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		posts: state.post,
		teams: state.team,
		profiles: state.profile
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params))
	}
}

export default connect(stateToProps, mapDispatchToProps)(Feed)
