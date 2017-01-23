import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'
import { DateUtils } from '../../utils'

export default (props) => {
	const comment = props.comment

	let align = 'left'
	if (props.user)
		align = (props.user.id == comment.profile.id) ? 'right' : 'left'

	return (
		<div className="panel-body" style={localStyle.container}>
			{ (align == 'right') ? <div className="col_one_fourth" style={{marginBottom:0, minHeight:20}}></div> : null }

			<div className="col_three_fourth col_last" style={{marginBottom:0}}>
				<div style={ (align=='left') ? localStyle.bubbleBlue : localStyle.bubbleWhite}>
					{ comment.text }
					<br />
					<div style={{textAlign:'right', marginTop:12}}>
						<span style={localStyle.detail}><Link to={'/profile/'+comment.profile.slug}>{ comment.profile.username }</Link></span>
						<span style={localStyle.separator}>|</span>
						<span style={localStyle.detail}>{ DateUtils.formattedDate(comment.timestamp) }</span>
					</div>
				</div>
			</div>
		</div>
	)
}

const localStyle = {
	container: {
		fontWeight:100,
		color:'#333',
		background:'#f9f9f9',
		textAlign: 'left'
	},
	bubbleWhite: {
		background:'#fff',
		padding: 9,
		border: '1px solid #ddd'
	},
	bubbleBlue: {
		background:'#FCFDFF',
		padding:9,
		border: '1px solid #ddd'
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