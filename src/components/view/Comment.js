import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'

class Comment extends Component {
	render(){
		const style = styles.comment
		const comment = this.props.comment
		const profile = comment.profile

		return (
			<div style={style.container}>
				<div style={style.rightBox}>
					username<br />
					Nov 10
				</div>
				<div style={style.body}>
					<Link style={style.header} to={'/profile/'+profile.username}>
						{profile.username}
					</Link>
					<br />
					{comment.text}
				</div>
			</div>			
		)
	}
}

export default Comment