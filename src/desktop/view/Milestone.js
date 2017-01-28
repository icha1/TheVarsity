import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils, TextUtils } from '../../utils'
import styles from './styles'

export default (props) => {
	const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const milestone = props

	let dateParts = milestone.timestamp.split('T')
	dateParts = dateParts[0].split('-') // 2017-01-28
	const day = dateParts[dateParts.length-1]
	const month = dateParts[1]

	const maxWidth = props.maxWidth || 560
	const withIcon = props.withIcon || false
	return (
		<div className="entry clearfix" style={{border:'none', marginBottom:12, paddingBottom:12, maxWidth:maxWidth}}>
			<div className="entry-timeline" style={ (withIcon) ? {background:'url("'+milestone.project.image+'=s64-c")'} : null}>
				{ (withIcon) ? null : 
					<div>
						{ months[parseInt(month)] }<span>{ day }</span>
						<div className="timeline-divider"></div>
					</div>
				}
			</div>
			<div className="entry-image">
				<div className="panel panel-default">
					<div className="panel-body">
						<h4 style={localStyle.title}>{milestone.title}</h4>
						{milestone.description}
						<hr />

						<Link to={'/profile/'+milestone.profile.slug}>
							<img style={localStyle.icon} src={milestone.profile.image+'=s72-c'} />
							<div style={{lineHeight:14+'px', paddingTop:3}}>
								<span style={{float:'right'}}>{ milestone.profile.username }</span><br />
								<span style={{float:'right'}}>{ TextUtils.capitalize(milestone.profile.title) }</span>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

const localStyle = {
	icon: {
		width: 36,
		borderRadius: 18,
		marginLeft: 12,
		float: 'right'
	},
	container: {
		border:'none', marginBottom:12, paddingBottom:12, maxWidth:560
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	}
}