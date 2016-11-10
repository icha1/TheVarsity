import React, { Component } from 'react'
import styles from './styles'

class Comment extends Component {
	render(){
		const style = styles.comment

		return (
			<div style={style.container}>
				<div style={style.rightBox}>
					username<br />
					Nov 10
				</div>
				<div style={style.body}>
					<span style={style.header}>Title</span><br />
				</div>
			</div>			
		)
	}
}

export default Comment