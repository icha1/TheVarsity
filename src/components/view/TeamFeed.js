import React, { Component } from 'react'
import { Link } from 'react-router'
import TeamPreview from './TeamPreview'
import { DateUtils } from '../../utils'
import styles from './styles'

class TeamFeed extends Component {

	render(){
		const listClass = 'commentlist noborder nomargin nopadding clearfix'
		const listItemClass = 'comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1'

//		const list = this.props.posts

		return (
			<ol className={listClass}>
				{
					this.props.teams.map((team, i) => {
						return (
							<li key={team.id} className={listItemClass} id="li-comment-2">
								<TeamPreview team={team} />
							</li>
						)
					})
				}
			</ol>
		)
	}
}


export default TeamFeed