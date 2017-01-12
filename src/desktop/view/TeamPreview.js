import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils, TextUtils } from '../../utils'
import styles from './styles'

class TeamPreview extends Component {

	render(){
		const team = this.props.team
		const style = styles.post

		return (
			<div>
				<div className="comment-wrap clearfix hidden-xs" style={styles.post.container}>
					<div className="comment-meta">
						<div className="comment-author vcard">
							<span className="comment-avatar clearfix">
							<img alt='The Varsity' src={team.image+'=s120-c'} className='avatar avatar-60 photo' height='60' width='60' /></span>
						</div>
					</div>
					<div className={styles.post.content.className} style={styles.post.content}>
						<div className="col_two_third" style={{marginBottom:4}}>
							<h2 style={styles.post.header}>
								<Link to={'/team/'+team.slug} style={styles.post.title}>{ team.name }</Link>
							</h2>
							<p style={{marginTop:0}}>{ TextUtils.truncateText(team.description, 220) }</p>
						</div>
						<div className="col_one_third col_last" style={{marginBottom:4, textAlign:'right'}}>
							<img style={styles.image} src={team.image} />
						</div>
					</div>
					<hr />

					<h4 style={styles.post.header}>Category</h4>
					<span>{ TextUtils.capitalize(team.type) }</span><br />
					<div style={{float:'right'}} className="dropdown">
						<a href="#" style={{border:'none'}} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
							<img style={{width:32, float:'right'}} src="/images/dots.png" />
						</a>
						<ul className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu1">
							<li style={styles.post.listItem}><a href="#">Share</a></li>
							<li style={styles.post.listItem}><a href="#">Save</a></li>
						</ul>
					</div>
				</div>

				{ /* mobile ui */}
				<div className="clearfix visible-xs" style={{borderBottom:'1px solid #ededed', padding:'0px 0px 12px 12px'}}>
					<div className="comment-content clearfix" style={{textAlign:'left'}}>
						<Link to={'/team/'+team.slug}>
							<img alt='The Varsity' className='avatar avatar-60 photo' style={{borderRadius:24, float:'right', marginRight:12}} src={team.image+'=s96-c'} width="48" height="48" />
						</Link>
						<div style={{marginBottom: 25}}>
							<Link to={'/team/'+team.slug}>
								<h3 style={style.header}>{ team.name }</h3>
								<p style={{marginTop:0}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(TextUtils.truncateText(team.description, 120))}}></p>
							</Link>
						</div>
					</div>
					<div style={{paddingRight:12}}>
						<span style={localStyle.detail}><Link to={'/team/'+team.slug}>{team.type}</Link></span>
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

export default TeamPreview