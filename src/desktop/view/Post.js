import React, { Component } from 'react'
import { Link } from 'react-router'
import { TextUtils, DateUtils } from '../../utils'
import styles from './styles'

class Post extends Component {

	save(event){
		event.preventDefault()
		this.props.savePost(this.props.post)
	}

	unsave(event){
		event.preventDefault()
		this.props.unsavePost(this.props.post)
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

//		const path = (post.author.type == 'team') ? post.author.slug : post.author.slug
		const title = (post.url.length == 0) ? <Link to={'/post/'+post.slug} style={style.title}>{ TextUtils.truncateText(post.title, 30) }</Link> : <a target='_blank' style={style.title} href={post.url}>{TextUtils.truncateText(post.title, 30) }</a>
		const numCommentsBadge = (post.numComments == 0) ? null : <span style={{float:'right'}} className="badge">{post.numComments}</span>

		const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
		const colClass = (post.image.length == 0) ? 'col_full col_last' : 'col_two_third'
		return (
			<div className={styles.post.container.className} style={style.container}>
				<div className="comment-meta">
					<div className="comment-author vcard">
						<span className="comment-avatar clearfix">
							<Link to={'/'+post.author.type+'/'+post.author.slug}>
								<img alt='The Varsity' src={post.author.image+'=s120-c'} className='avatar avatar-60 photo' height='60' width='60' />
							</Link>
						</span>
					</div>
				</div>
				<div className={style.content.className} style={style.content}>
					<div className={colClass} style={{marginBottom:4}}>
						<h3 style={style.header}>{ title }</h3>
						<p style={{marginTop:0}}>{ TextUtils.truncateText(post.text, 120) }</p>
					</div>

					{ (post.image.length == 0) ? null :
						<div className="col_one_third col_last" style={{marginBottom:8, textAlign:'right'}}>
							<img style={style.postImage} src={post.image} />
						</div>
					}
				</div>
				<div style={{float:'left'}} className="dropdown">
					<a href="#" style={{border:'none'}} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
						<img style={{width:32, float:'right'}} src="/images/dots.png" />
					</a>
					<ul className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu1">
						<li style={style.listItem}><a href="#">Share</a></li>
						<li style={style.listItem}><Link to={'/post/'+post.slug+'?selected=chat'}>Comments { numCommentsBadge }</Link></li>
						{ (saved) ? <li style={style.listItem}><a onClick={this.unsave.bind(this)} href="#">Unsave</a></li> : <li style={style.listItem}><a onClick={this.save.bind(this)} href="#">Save</a></li> }
					</ul>

				</div>
				<span style={localStyle.detail}><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span>
				<span style={localStyle.separator}>|</span>
				<span style={localStyle.detail}>{ DateUtils.formattedDate(post.timestamp) }</span>
				<span style={localStyle.separator}>|</span>
				<span style={localStyle.detail}>{ TextUtils.capitalize(post.type) }</span>
			</div>
		)
	}
}

const localStyle = {
	detail: {
		float:'right',
		color: '#1265A8',
		fontWeight:100,
		fontSize:12,
		lineHeight:12+'px'
	},
	separator: {
		float:'right',
		color: '#1265A8',
		fontWeight:100,
		fontSize:10,
		lineHeight:10+'px',
		marginLeft:6,
		marginRight:6
	}

}


export default Post