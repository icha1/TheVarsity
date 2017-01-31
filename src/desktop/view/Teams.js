import React, { Component } from 'react'
import { Link } from 'react-router'
import { TextUtils } from '../../utils'
import styles from './styles'

export default (props) => {

	const teams = props.teams
	return (
		<div>
			<h2 style={styles.title}>Teams</h2>
			<hr />
			<nav id="primary-menu">
				{ (teams == null) ? null : teams.map((team, i) => {
						return (
							<div key={team.id} style={{padding:'16px 16px 16px 0px'}}>
								<Link to={'/team/'+team.slug}>
									<img style={localStyle.image} src={team.image+'=s44-c'} />
								</Link>
								<Link style={localStyle.detailHeader} to={'/team/'+team.slug}>
									{team.name}
								</Link>
								<br />
								<span style={localStyle.subtext}>{ TextUtils.capitalize(team.type) }</span>
							</div>
						)
					})
				}
			</nav>
		</div>

	)
}

const localStyle = {
	image: {
		float:'left',
		marginRight:12,
		borderRadius:22,
		width:44
	},
	detailHeader: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		fontSize: 18,
		lineHeight: 10+'px'
	},
	subtext: {
		fontWeight:100,
		fontSize:14,
		lineHeight:14+'px'
	}
}