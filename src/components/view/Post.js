import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils } from '../../utils'
import styles from './styles'

class Post extends Component {

	render(){
		const post = this.props.post
		const style = styles.post

		const path = (post.author.type == 'team') ? post.author.slug : post.author.name
		const title = (post.url.length == 0) ? <Link to={'/post/'+post.slug} style={style.title}>{ post.title }</Link> : <a target='_blank' style={style.title} href={post.url}>{post.title}</a>
		return (
			<div className={styles.post.container.className} style={style.container}>
				<div className="comment-meta">
					<div className="comment-author vcard">
						<span className="comment-avatar clearfix">
						<img alt='The Varsity' src={post.author.image+'=s120-c'} className='avatar avatar-60 photo' height='60' width='60' /></span>
					</div>
				</div>
				<div className={style.content.className} style={style.content}>
					<div className="col_two_third" style={{marginBottom:4}}>
						<h2 style={style.header}>
							{ title }
						</h2>
						<p style={{marginTop:0}}>{ post.text }</p>
					</div>
					<div className="col_one_third col_last" style={{marginBottom:4}}>
						<img style={styles.postImage} src={post.image} />
					</div>
				</div>
				<hr />

				<h4 style={style.header}>
					<Link to={'/'+post.author.type+'/'+path} style={style.title}>{ post.author.name }</Link>
				</h4>
				<span>{DateUtils.formattedDate(post.timestamp)}</span><br />
				<a href="#" style={{marginLeft: 0}} className="button button-mini button-circle button-red">{ post.type }</a>

				<div style={{float:'right'}} className="dropdown">
					<a href="#" style={{border:'none'}} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
						<img style={{width:32, float:'right'}} src="/images/dots.png" />
					</a>
					<ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
						<li style={style.listItem}><a href="#">Share</a></li>
						<li style={style.listItem}><a href="#">Attend</a></li>
						<li style={style.listItem}><a href="#">Comments <span style={{float:'right'}} className="badge">5</span></a></li>
						<li style={style.listItem}><a href="#">Save</a></li>
					</ul>
				</div>
			</div>
		)
	}
}


export default Post