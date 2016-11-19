import React, { Component } from 'react'
import { Link } from 'react-router'
import Post from './Post'
import { DateUtils } from '../../utils'
import styles from './styles'

class PostFeed extends Component {

	render(){
		const listClass = 'commentlist noborder nomargin nopadding clearfix'
		const listItemClass = 'comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1'

		return (
			<ol className={listClass}>
				{
					this.props.posts.map((post, i) => {
						return (
							<li key={post.id} className={listItemClass} id="li-comment-2">
								<Post post={post} />
							</li>
						)
					})
				}
			</ol>
		)
	}
}


export default PostFeed