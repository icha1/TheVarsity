import React, { Component } from 'react'
import Comment from './Comment'
import styles from './styles'

export default (props) => {

	return (
		<div>
			<div style={localStyle.container}>
				<div style={localStyle.scroll}>
					{ props.comments.map((comment, i) => {
							return (
								<Comment key={comment.id} user={props.user} comment={comment} />
							)
						})
					}
				</div>
				<input style={localStyle.input} onKeyPress={props.keyPress.bind(this)} placeholder="Enter Comment" type="text" />
			</div>
		
			{ (props.comments.length > 0) ? null : 
				<div style={{fontWeight:100, border:'1px solid #ddd', padding:24, fontSize:16}}>
					<h3 style={localStyle.title}>What</h3>
					<p style={localStyle.paragraph}>
						TEST
					</p>

					<hr />

					<h3 style={localStyle.title}>Why</h3>
					<p style={localStyle.paragraph}>
						TEST
					</p>
				</div>
			}
		</div>
	)
}


const localStyle = {
	container: {
		border: '1px solid #ddd',
		marginTop: 24, 
		marginBottom: 24
	},
	paragraph: {
		marginTop: 0,
		marginBottom:24
	},
	scroll: {
		overflowY:'scroll',
		maxHeight:360, 
		background:'#f9f9f9',
		padding:0,
		borderBottom:'1px solid #ddd'
	},
	input: {
		color:'#333',
		background: '#fff',
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%',
		marginTop: 0
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	},
	btnSmall: {
		float:'right',
		marginTop:0,
		className: 'button button-small button-border button-border-thin button-blue'
	}
}

