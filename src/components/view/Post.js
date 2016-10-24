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
					<div className="col_two_third">
						<h2 style={styles.post.header}>
							<Link to={'/venue/'+post.venue.slug} style={styles.post.title}>{ post.title }</Link>
						</h2>
						<p style={{marginTop:0, marginBottom:12}}>{ post.text }</p>
					</div>
					<div className="col_one_third col_last">
						<img style={styles.postImage} src={post.image} />
					</div>
				</div>
				<hr />
				<h4 style={styles.post.header}>
					<Link to={'/venue/'+post.venue.slug} style={styles.post.title}>{ post.title }</Link>
				</h4>
				<span>{ post.venue.address }</span>
				<span style={{float:'right'}}>{DateUtils.formattedDate(post.timestamp)}</span>
				<div className="clear"></div>
			</div>
		)
	}
}


export default Post