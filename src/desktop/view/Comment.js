import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'
import { DateUtils } from '../../utils'

export default (props) => {
	const comment = props.comment

	return (
		<div className="panel-body" style={localStyle.container}>
			{ comment.text }
			<div style={{textAlign:'right', marginTop:12}}>
				<span style={localStyle.detail}><Link to={'/profile/'+comment.profile.slug}>{ comment.profile.username }</Link></span>
				<span style={localStyle.separator}>|</span>
				<span style={localStyle.detail}>{ DateUtils.formattedDate(comment.timestamp) }</span>
			</div>
		</div>
	)
}

const localStyle = {
	container: {
		fontWeight:100,
		color:'#333',
		background:'#FCFDFF',
		borderBottom:'1px solid #ddd',
		textAlign: 'left'
	},
	separator: {
		marginLeft: 8,
		marginRight: 8,
		fontSize: 10,
		fontWeight: 100
	},
	detail: {
		fontWeight: 100,
		fontSize: 12
	}
}