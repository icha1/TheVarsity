import React, { Component } from 'react'
import { Link } from 'react-router'
import { TextUtils, DateUtils } from '../../utils'
import styles from './styles'

class Post extends Component {

	save(event){
		event.preventDefault()
		this.props.savePost(this.props.post)
	}

	render(){
		const post = this.props.post
		const user = this.props.user // can be null
		const style = styles.post

		let saved = false
		if (user != null){
			if (post.saved.indexOf(user.id) != -1)
				saved = true
		}

		const path = (post.author.type == 'team') ? post.author.slug : post.author.name
		const title = (post.url.length == 0) ? <Link to={'/post/'+post.slug} style={style.title}>{ TextUtils.truncateText(post.title, 30) }</Link> : <a target='_blank' style={style.title} href={post.url}>{TextUtils.truncateText(post.title, 30) }</a>
		const numCommentsBadge = (post.numComments == 0) ? null : <span style={{float:'right'}} className="badge">{post.numComments}</span>

		let submenu = null 
		if (post.type == 'news'){
			submenu = (
				<ul className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu1">
					<li style={style.listItem}><a href="#">Share</a></li>
					<li style={style.listItem}><Link to={'/post/'+post.slug+'?selected=chat'}>Comments { numCommentsBadge }</Link></li>
					{ (saved) ? <li style={style.listItem}><a href="#">Saved</a></li> : <li style={style.listItem}><a onClick={this.save.bind(this)} href="#">Save</a></li> }
				</ul>
			)
		}
		else {
			submenu = (
				<ul className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu1">
					<li style={style.listItem}><a href="#">Share</a></li>
					<li style={style.listItem}><Link to={'/post/'+post.slug+'?selected=attend'}>Attend</Link></li>
					<li style={style.listItem}><Link to={'/post/'+post.slug+'?selected=chat'}>Comments { numCommentsBadge }</Link></li>
					{ (saved) ? <li style={style.listItem}><a href="#">Saved</a></li> : <li style={style.listItem}><a onClick={this.save.bind(this)} href="#">Save</a></li> }

				</ul>
			)
		}

		const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
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
						<h2 style={style.header}>{ title }</h2>
						<p style={{marginTop:0}}>{ TextUtils.truncateText(post.text, 120) }</p>
					</div>
					<div className="col_one_third col_last" style={{marginBottom:4}}>
						<img style={style.postImage} src={post.image} />
					</div>
				</div>
				<hr />

				<h4 style={style.header}>
					<Link to={'/'+post.author.type+'/'+path} style={style.title}>{ post.author.name }</Link>
				</h4>
				<span>{DateUtils.formattedDate(post.timestamp)}</span><br />
				<a href="#" style={{marginLeft: 0}} className={btnClass}>{ post.type }</a>

				<div style={{float:'right'}} className="dropdown">
					<a href="#" style={{border:'none'}} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
						<img style={{width:32, float:'right'}} src="/images/dots.png" />
					</a>
					{ submenu }
				</div>
			</div>
		)
	}
}


export default Post