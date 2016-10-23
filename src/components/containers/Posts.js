import React, { Component } from 'react'
import { APIManager } from '../../utils'
import { Post } from '../view'
import store from '../../stores/store'
import actions from '../../actions/actions'
import { connect } from 'react-redux'

class Posts extends Component {
	constructor(){
		super()
		this.state = {

		}
	}

	componentDidMount(){
//		console.log('LAT/LNG: '+JSON.stringify(this.props.location))
		const params = {
			limit: 10,
			lat: this.props.location.lat,
			lng: this.props.location.lng
		}

		APIManager.handleGet('/api/post', params, (err, response) => {
			if (err){
				alert(err)
				return
			}

//			console.log(JSON.stringify(response.results))
			store.currentStore().dispatch(actions.postsReceived(response.results))
		})
	}

	render(){
		const currentPosts = this.props.posts.map((post, i) => {
			return (
				<li key={post.id} className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
					<Post post={post} />
				</li>
			)
		})

		return (
			<ol className="commentlist noborder nomargin nopadding clearfix">
				{ currentPosts }
			</ol>

		)
	}
}

const stateToProps = (state) => {
	return {
		posts: state.post.list,
		location: state.location.currentLocation
	}
}

export default connect(stateToProps)(Posts)
