import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'
import { DateUtils } from '../../utils'
import Comment from './Comment'

export default (props) => {

	const list = props.comments || []
	return (
		<div style={{border:'1px solid #ddd'}}>
			{ list.map((comment, i) => {
					return <Comment key={comment.id} comment={comment} user={props.user} />
				})
			}

			{ (list.length > 0) ? null : <div style={{height:300, background:'#f9f9f9'}}></div>}

			<div style={(list.length==0) ? {borderTop:'1px solid #ddd'} : null}>
				<input type="text" id="text" style={localStyle.input} onKeyPress={props.submitComment.bind(this)} placeholder="Enter Comment" />
			</div>
		</div>
	)
}

const localStyle = {
	input: {
		color:'#333',
		background: '#fff',
		marginBottom: 0,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	}
}