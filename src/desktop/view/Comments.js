import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'
import { DateUtils } from '../../utils'
import Comment from './Comment'

export default (props) => {

	return (
		<div>
			<div className="panel-heading">Comments</div>
			{ (props.comments == null) ? null : props.comments.map((comment, i) => {
					return <Comment key={comment.id} comment={comment} />
				})
			}

			<div>
				<input type="text" id="text" style={localStyle.input} onKeyPress={props.submitComment.bind(this)} placeholder="Enter Comment" />
			</div>
		</div>
	)
}

const localStyle = {
	input: {
		color:'#333',
		background: '#f9f9f9',
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