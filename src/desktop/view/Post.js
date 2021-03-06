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

	vote(upOrDown, event){
		event.preventDefault()
		this.props.onVote(this.props.post, upOrDown)
	}

	render(){
		const post = this.props.post
		const user = this.props.user // can be null
		const style = styles.post

		let link = null
		if (post.url.length > 0){ // https://www.f6s.com/jobs
			const parts = post.url.split('//') // www.f6s.com/jobs
			if (parts.length > 1)
				link = parts[1].split('/')[0].replace('www.', '')
		}

		let saved = false
		let deleteLink = null
		if (user != null){
			if (post.saved.indexOf(user.id) != -1)
				saved = true

			if (user.id == post.author.id)
				deleteLink = <li style={style.listItem}><a style={{color:'red'}} href="#" onClick={this.deletePost.bind(this)}>Delete</a></li>
		}

		const path = (post.type == 'project') ? '/project/'+post.slug : '/post/'+post.slug
		const title = <Link to={path} style={style.title}>{ TextUtils.truncateText(post.title, 50) }</Link>
		const numCommentsBadge = (post.numComments == 0) ? null : <span style={{float:'right'}} className="badge">{post.numComments}</span>

		const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
		const colClass = (post.image.length == 0) ? 'col_full col_last' : 'col_two_third'
		return (
			<div>
				<div className="comment-wrap clearfix hidden-xs" style={style.container}>
					<div className="comment-meta">
						<div className="comment-author vcard">
							<span className="comment-avatar clearfix">
								<Link to={path}>
									<img alt='The Varsity' src={'/images/'+post.type+'.png'} className='avatar avatar-60 photo' height='60' width='60' />
								</Link>
							</span>
						</div>
					</div>
					<div className={style.content.className} style={style.content}>
						<div className={colClass} style={{marginBottom:4}}>
							{ (link == null) ? null : <a style={{color:'#1265A8'}} target="_blank" href={post.url}>{link}</a> }
							<h3 style={style.header}>{ title }</h3>
							<Link to={path}>
								<p style={{marginTop:0}} dangerouslySetInnerHTML={{__html:TextUtils.truncateText(post.text, 120)}}></p>
							</Link>
						</div>

						{ (post.image.length == 0) ? null :
							<div className="col_one_third col_last" style={{marginBottom:8, textAlign:'right'}}>
								<Link to={path}>
									<img style={style.postImage} src={post.image+'=s140-c'} />
								</Link>
							</div>
						}
					</div>
					<div style={{float:'left'}} className="dropdown">
						<a href="#" style={{border:'none'}} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
							<img style={{width:32, float:'right'}} src="/images/dots.png" />
						</a>
						<ul className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu1">
							<li style={style.listItem}><a onClick={this.vote.bind(this, 'up')} href="#">Upvote</a></li>
							<li style={style.listItem}><a onClick={this.vote.bind(this, 'down')} href="#">Downvote</a></li>
							{ (saved) ? <li style={style.listItem}><a onClick={this.unsave.bind(this)} href="#">Unsave</a></li> : <li style={style.listItem}><a onClick={this.save.bind(this)} href="#">Save</a></li> }
							{ deleteLink }
						</ul>
					</div>
					<span style={localStyle.detail}>{ DateUtils.formattedDate(post.timestamp) }</span>
					<span style={localStyle.separator}>|</span>
					<span style={localStyle.detailRed}><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span>
					<span style={localStyle.separator}>|</span>
					<span style={localStyle.detail}>{ post.votes.score } pts</span>
				</div>

				{ /* mobile ui */}
				<div className="clearfix visible-xs" style={{borderBottom:'1px solid #ededed', padding:'0px 0px 12px 12px'}}>
					<div className="comment-content clearfix" style={{textAlign:'left'}}>
						{ (post.image.length == 0) ? null : (
								<Link to={path}>
									<img alt='The Varsity' className='avatar avatar-60 photo' style={{borderRadius:24, float:'right', marginRight:12}} src={ (post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s96-c'} width="48" height="48" />
								</Link>
							)
						}

						<div style={{marginBottom: 25}}>
							{ (link == null) ? null : <a style={{color:'#1265A8'}} target="_blank" href={post.url}>{link}</a> }
							<h3 style={style.header}>{ title }</h3>
							<Link to={path}>
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