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
						<img alt='The Varsity' src={post.author.image+'=s120-c'} className='avatar avatar-60 photo' height='60' width='60' /></span>
					</div>
				</div>
				<div className={styles.post.content.className} style={styles.post.content}>
					<div className="col_two_third" style={{marginBottom:4}}>
						<h2 style={styles.post.header}>
							<Link to={'/post/'+post.slug} style={styles.post.title}>{ post.title }</Link>
						</h2>
						<p style={{marginTop:0}}>{ post.text }</p>
					</div>
					<div className="col_one_third col_last" style={{marginBottom:4}}>
						<img style={styles.postImage} src={post.image} />
					</div>
				</div>
				<hr />

				<h4 style={styles.post.header}>
					<Link to={'/team/'+post.author.slug} style={styles.post.title}>{ post.author.name }</Link>
				</h4>
				<span>{DateUtils.formattedDate(post.timestamp)}</span><br />
				<a href="#" style={{marginLeft: 0}} className="button button-mini button-circle button-red">{ post.type }</a>

				<div style={{float:'right'}} className="dropdown">
					<a href="#" style={{border:'none'}} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
						<img style={{width:32, float:'right'}} src="/images/dots.png" />
					</a>
					<ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
						<li><a href="#">Profile</a></li>
						<li><a href="#">Messages <span className="badge">5</span></a></li>
						<li><a href="#">Settings</a></li>
						<li role="separator" className="divider"></li>
						<li><a href="#">Logout <i className="icon-signout"></i></a></li>
					</ul>
				</div>				
			</div>
		)
	}
}


export default Post