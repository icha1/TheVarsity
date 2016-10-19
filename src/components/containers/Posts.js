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
		APIManager.handleGet('/api/post', this.props.currentLocation, (err, response) => {
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
			<div className="content-wrap container clearfix">

				<div className="col_full col_last">
					<ol className="commentlist noborder nomargin nopadding clearfix">

						{ currentPosts }
					</ol>

				</div>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		posts: state.postReducer.postsArray,
		location: state.locationReducer.currentLocation
	}
}

export default connect(stateToProps)(Posts)
