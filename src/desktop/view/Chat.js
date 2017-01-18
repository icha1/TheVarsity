import React, { Component } from 'react'
import Comment from './Comment'
import styles from './styles'

export default (props) => {

	//onKeyPress={this.keyPress.bind(this, 'comment')} 
	return (
		<div style={localStyle.container}>
			<div style={localStyle.scroll}>
				{ props.comments.map((comment, i) => {
						return (
							<Comment key={comment.id} comment={comment} />
						)
					})
				}
			</div>
			<input style={localStyle.input} onKeyPress={props.keyPress.bind(this)} placeholder="Enter Comment" type="text" />
		</div>

	)
}


const localStyle = {
	container: {
		border:'1px solid #ddd',
		marginTop:24, 
		marginBottom:0
	},
	scroll: {
		overflowY:'scroll',
		maxHeight:360, 
		background:'#FCFDFF',
		padding:0
	},
	input: {
		color:'#333',
		background: '#f9f9f9',
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%',
		marginTop: 0
	}	

}

