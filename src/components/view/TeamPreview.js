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
						<img style={styles.postImage} src={team.image} />
					</div>
				</div>
				<hr />

			</div>
		)
	}
}


export default TeamPreview