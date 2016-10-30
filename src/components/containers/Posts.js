import React, { Component } from 'react'
import { APIManager } from '../../utils'
import { Post } from '../view'
import store from '../../stores/store'
import actions from '../../actions/actions'
import { connect } from 'react-redux'

class Posts extends Component {
	constructor(){
		super()
		this.fetchPosts = this.fetchPosts.bind(this)
		this.state = {

		}
	}

	componentDidMount(){
		store.currentStore().subscribe(() => {
			setTimeout(() => { // this is a sloppy workaround
//				console.log('STORE CHANGED: ' + this.props.selectedFeed)
				console.log('RELOAD: ' + this.props.selectedFeed +', '+ this.props.reload)
				if (this.props.reload)
					this.fetchPosts()
			}, 5)

		})

		this.fetchPosts()
	}

	fetchPosts(){
		const params = {
			limit: 10,
			type: this.props.selectedFeed,
			lat: this.props.location.lat,
			lng: this.props.location.lng
		}

//		console.log('PARAMS: '+JSON.stringify(params))
		APIManager.handleGet('/api/post', params, (err, response) => {
			if (err){
				alert(err)
				return
			}

//			console.log(JSON.stringify(response))
			store.currentStore().dispatch(actions.postsReceived(response.results))
		})		
	}

	render(){
		const list = this.props.posts[this.props.selectedFeed]
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


		return (
			<ol className="commentlist noborder nomargin nopadding clearfix">
				{ currentPosts }
			</ol>

		)
	}
}

const stateToProps = (state) => {
	return {
		posts: state.post.feed,
		location: state.session.currentLocation,
		selectedFeed: state.session.selectedFeed,
		reload: state.session.reload
	}
}

export default connect(stateToProps)(Posts)
