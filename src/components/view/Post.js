import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils } from '../../utils'
import styles from './styles'

class Post extends Component {

	render(){
		const post = this.props.post
		return (
			<div className={styles.post.container.className} style={styles.post.container}>
				<div className="comment-meta">
					<div className="comment-author vcard">
						<span className="comment-avatar clearfix">
						<img alt='The Varsity' src={post.venue.image+'=s120-c'} className='avatar avatar-60 photo' height='60' width='60' /></span>
					</div>
				</div>
				<div className={styles.post.content.className} style={styles.post.content}>
					<span style={{float:'right'}}>{DateUtils.formattedDate(post.timestamp)}</span>
					<h2 style={styles.post.header}>
						<Link to={'/venue/'+post.venue.slug} style={styles.post.title}>{ post.title }</Link>
					</h2>
					<div className="row">
						<div className="col-md-8">
							<p style={{marginTop:0}}>{ post.text }</p>
						</div>
						<div className="col-md-4">
							<img style={styles.postImage} src={post.image} />
						</div>
					</div>
				</div>
				<hr />
				<h4 style={styles.post.header}>
					<Link to={'/venue/'+post.venue.slug} style={styles.post.title}>{ post.title }</Link>
				</h4>
				<span>{ post.venue.address }</span>

				<div className="clear"></div>
			</div>
		)
	}
}


export default Post