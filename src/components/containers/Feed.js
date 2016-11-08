import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { APIManager, DateUtils } from '../../utils'
import { Post, CreatePost, CreateTeam, TeamPreview } from '../view'
import store from '../../stores/store'
import constants from '../../constants/constants'
import actions from '../../actions/actions'
import styles from './styles'

class Feed extends Component {
	constructor(){
		super()
		this.fetchPosts = this.fetchPosts.bind(this)
		this.state = {
			showCreate: false
		}
	}

	componentDidMount(){
		store.currentStore().subscribe(() => {
			setTimeout(() => { // this is a sloppy workaround
				console.log('RELOAD: ' + this.props.session.selectedFeed +', '+ this.props.session.reload)
				if (this.props.session.reload){ // TODO: check selected feed
					const selectedFeed = this.props.session.selectedFeed
					if (selectedFeed == constants.FEED_TYPE_EVENT || selectedFeed == constants.FEED_TYPE_NEWS)
						this.fetchPosts()
					// else if (selectedFeed == constants.FEED_TYPE_TEAM)
					// 	this.fetchTeams()
				}
			}, 5)
		})

		this.fetchPosts()
	}

	toggleShowCreate(event){
		if (event != null)
			event.preventDefault()

		window.scrollTo(0, 0)
		this.setState({
			showCreate: !this.state.showCreate
		})
	}

	toggleLoader(isLoading){
		this.props.toggleLoader(isLoading)
	}

	fetchPosts(){
		const session = this.props.session
		const params = {
			limit: 10,
			type: session.selectedFeed,
			lat: session.currentLocation.lat,
			lng: session.currentLocation.lng
		}

		console.log('FETCH POSTS: '+JSON.stringify(params))

		APIManager.handleGet('/api/post', params, (err, response) => {
			if (err){
				alert(err)
				return
			}

			this.props.postsReceived(response.results)
			this.setState({showCreate: false})
		})
	}

	submitPost(post){
		console.log('submitPost: '+JSON.stringify(post))
		const currentLocation = this.props.session.currentLocation
		post['geo'] = [
			currentLocation.lat,
			currentLocation.lng
		]
		
		APIManager.handlePost('/api/post', post, (err, response) => {
			if (err){
				alert(err)
				return
			}

			this.props.postCreated(response.result)
			this.setState({showCreate: false})
			window.scrollTo(0, 0)
		})
	}

	createTeam(team){
		const district = this.props.session.district
		team['district'] = district.id

		let address = Object.assign({}, team.address)
		address['city'] =  district.city
		address['state'] = district.state
		team['address'] = address

//		console.log('createTeam: '+JSON.stringify(team))

		this.props.toggleLoader(true)
		APIManager.handlePost('/api/team', team, (err, response) => {
			this.props.toggleLoader(false)
			if (err){
				alert(JSON.stringify(err))
				return
			}

			console.log('TEAM CREATED: '+JSON.stringify(response))
			this.setState({showCreate: false})
		})		
	}

	render(){
		const feed = this.props.session.selectedFeed
		let currentFeed = null
		if (feed == constants.FEED_TYPE_TEAM){
			currentFeed = this.props.session.teams.map((team, i) => {
				return (
					<li key={team.id} className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
						<TeamPreview team={team} />
					</li>
				)
			})
		}
		else {
			const list = this.props.posts[feed]
			if (list != null){
				currentFeed = list.map((post, i) => {
					return (
						<li key={post.id} className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
							<Post post={post} />
						</li>
					)
				})
			}
		}

		let create = null
		if (feed == constants.FEED_TYPE_EVENT || feed == constants.FEED_TYPE_NEWS){ 
			create = (
				<li className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
					<CreatePost
						type={this.props.session.selectedFeed}
						user={this.props.user}
						teams={this.props.teams}
						isLoading={this.toggleLoader.bind(this)}
						submit={this.submitPost.bind(this)}
						cancel={this.toggleShowCreate.bind(this)} />
				</li>
			)
		}
		if (feed == 'team'){
			create = (
				<li className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
					<CreateTeam
						user={this.props.user}
						isLoading={this.toggleLoader.bind(this)}
						submit={this.createTeam.bind(this)}
						cancel={this.toggleShowCreate.bind(this)} />
				</li>
			)
		}

		return (
			<div>
				<ol className="commentlist noborder nomargin nopadding clearfix">
					{ (this.state.showCreate) ? create : currentFeed }
				</ol>

				{ (this.state.showCreate) ? null : <a href="#" onClick={this.toggleShowCreate.bind(this)} style={{position:'fixed', bottom:0}} className={styles.post.btnAdd.className}>Add {this.props.session.selectedFeed}</a> }
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		posts: state.post.feed,
		user: state.account.currentUser,
		teams: state.account.teams,
		session: state.session // district, currentLocation, teams, selectedFeed, reload
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postsReceived: posts => dispatch(actions.postsReceived(posts)),
		postCreated: post => dispatch(actions.postCreated(post)),
		toggleLoader: isLoading => dispatch(actions.toggleLoader(isLoading))
	}
}

export default connect(stateToProps, mapDispatchToProps)(Feed)
