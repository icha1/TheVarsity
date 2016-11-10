import React, { Component } from 'react'
import styles from './styles'

class Comment extends Component {
	render(){
		const style = styles.comment
		const comment = this.props.comment

		return (
			<div style={style.container}>
				<div style={style.rightBox}>
					username<br />
					Nov 10
				</div>
				<div style={style.body}>
					<span style={style.header}>{comment.profile.username}</span>
					<br />
					{comment.text}
				</div>
			</div>			
		)
	}
}

export default Comment