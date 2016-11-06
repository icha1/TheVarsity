import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { APIManager, DateUtils } from '../../utils'
import { Post, CreatePost, CreateTeam } from '../view'
import store from '../../stores/store'
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
				console.log('RELOAD: ' + this.props.selectedFeed +', '+ this.props.reload)
				if (this.props.reload){ // TODO: check selected feed
					const selectedFeed = this.props.selectedFeed
					if (selectedFeed == 'event'){

					}
					if (selectedFeed == 'post'){
						
					}
					if (selectedFeed == 'team'){
						
					}

					this.fetchPosts()
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
		const params = {
			limit: 10,
			type: this.props.selectedFeed,
			lat: this.props.location.lat,
			lng: this.props.location.lng
		}

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
	}

	createTeam(team){
		const district = this.props.district
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
		const feed = this.props.selectedFeed
		const list = this.props.posts[feed]
		let currentPosts = null
		if (list != null){
			currentPosts = list.map((post, i) => {
				return (
					<li key={post.id} className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
						<Post post={post} />
					</li>
				)
			})
		}

		let create = null
		if (feed == 'event' || feed == 'post'){ // post is news feed
			create = (
				<li className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
					<CreatePost
						type={this.props.selectedFeed}
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
					{ (this.state.showCreate) ? create : currentPosts }
				</ol>

				{ (this.state.showCreate) ? null : <a href="#" onClick={this.toggleShowCreate.bind(this)} style={{position:'fixed', bottom:0}} className={styles.post.btnAdd.className}>Add {this.props.selectedFeed}</a> }
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		posts: state.post.feed,
		user: state.account.currentUser,
		teams: state.account.teams,
		district: state.session.currentDistrict,
		location: state.session.currentLocation,
		selectedFeed: state.session.selectedFeed,
		reload: state.session.reload
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postsReceived: posts => dispatch(actions.postsReceived(posts)),
		toggleLoader: isLoading => dispatch(actions.toggleLoader(isLoading))
	}
}

export default connect(stateToProps, mapDispatchToProps)(Feed)
