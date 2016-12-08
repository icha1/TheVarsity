import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils, TextUtils } from '../../utils'
import styles from './styles'

class TeamPreview extends Component {

	render(){
		const team = this.props.team
		return (
			<div className={styles.post.container.className} style={styles.post.container}>
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
					<div className="col_one_third col_last" style={{marginBottom:4}}>
						<img style={styles.post.postImage} src={team.image} />
					</div>
				</div>
				<hr />

				<h4 style={styles.post.header}>{ team.address.street }</h4>
				<span>{ team.members.length } members</span><br />
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
		)
	}
}


export default TeamPreview