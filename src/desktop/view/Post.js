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

	deletePost(event){
		event.preventDefault()
		this.props.deletePost(this.props.post)
	}

	render(){
		const post = this.props.post
		const user = this.props.user // can be null
		const style = styles.post

		let saved = false
		let deleteLink = null
		if (user != null){
			if (post.saved.indexOf(user.id) != -1)
				saved = true

			if (user.id == post.author.id)
				deleteLink = <li style={style.listItem}><a style={{color:'red'}} href="#" onClick={this.deletePost.bind(this)}>Delete</a></li>
		}

		const title = (post.url.length == 0) ? <Link to={'/post/'+post.slug} style={style.title}>{ TextUtils.truncateText(post.title, 50) }</Link> : <a target='_blank' style={style.title} href={post.url}>{TextUtils.truncateText(post.title, 50) }</a>
		const numCommentsBadge = (post.numComments == 0) ? null : <span style={{float:'right'}} className="badge">{post.numComments}</span>

		const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
		const colClass = (post.image.length == 0) ? 'col_full col_last' : 'col_two_third'
		return (
			<div>
				<div className="comment-wrap clearfix hidden-xs" style={style.container}>
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
							<Link to={'/post/'+post.slug}>
								<p style={{marginTop:0}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(TextUtils.truncateText(post.text, 120))}}></p>
							</Link>
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
							{ deleteLink }
						</ul>
					</div>
					<span style={localStyle.detail}>{ TextUtils.capitalize(post.type) }</span>
					<span style={localStyle.separator}>|</span>
					<span style={localStyle.detail}>{ DateUtils.formattedDate(post.timestamp) }</span>
					<span style={localStyle.separator}>|</span>
					<span style={localStyle.detailRed}><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span>
				</div>

				{ /* mobile ui */}
				<div className="clearfix visible-xs" style={{borderBottom:'1px solid #ededed', padding:'0px 0px 12px 12px'}}>
					<div className="comment-content clearfix" style={{textAlign:'left'}}>
						{ (post.image.length == 0) ? null : (
								<Link to={'/post/'+post.slug}>
									<img alt='The Varsity' className='avatar avatar-60 photo' style={{borderRadius:24, float:'right', marginRight:12}} src={ (post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s96-c'} width="48" height="48" />
								</Link>
							)
						}

						<div style={{marginBottom: 25}}>
							<h3 style={style.header}>{ title }</h3>
							<Link to={'/post/'+post.slug}>
								<p style={{marginTop:0}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(TextUtils.truncateText(post.text, 120))}}></p>
							</Link>
						</div>

					</div>
					<div style={{paddingRight:12}}>
						<span style={localStyle.detail}>{ TextUtils.capitalize(post.type) }</span>
						<span style={localStyle.separator}>|</span>
						<span style={localStyle.detail}>{ DateUtils.formattedDate(post.timestamp) }</span>
						<span style={localStyle.separator}>|</span>
						<span style={localStyle.detailRed}><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span>
					</div>
				</div>
			</div>
		)
	}
}

const localStyle = {
	detailRed: {
		float:'right',
		color: 'red',
		fontWeight:400,
		fontSize:12,
		lineHeight:12+'px'
	},
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