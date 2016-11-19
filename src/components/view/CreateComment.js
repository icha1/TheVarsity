import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'

class CreateComment extends Component {
	constructor(){
		super()
		this.state = {
			comment: {
				profile: null,
				text: '',
				image: ''
			}
		}
	}

	updateComment(event){
//		console.log('UpdateComment: '+event.target.value)
		let updated = Object.assign({}, this.state.comment)
		updated['text'] = event.target.value
		this.setState({
			comment: updated
		})
	}

	keyPress(event){
		if (event.keyCode != 13)
			return

		console.log('CREATE COMMENT: '+JSON.stringify(this.state.comment))
		this.props.onCreate(this.state.comment)
		this.setState({
			comment: {
				profile: null,
				text: '',
				image: ''
			}			
		})
	}

	render(){
		const style = styles.comment

		return (
			<div style={{padding:16, background:'#ffffe6', borderTop:'1px solid #ddd'}}>
				<input value={this.state.comment.text} onKeyUp={this.keyPress.bind(this)} onChange={this.updateComment.bind(this)} type="text" className="form-control" />
			</div>
		)
	}
}

export default CreateComment