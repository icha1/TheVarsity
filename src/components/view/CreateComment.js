import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'

class CreateComment extends Component {
	constructor(){
		super()
		this.setComment = this.setComment.bind(this)
		this.state = {
			showDropdown: false,
			comment: {
				profile: null,
				text: '',
				image: ''
			}
		}
	}

	updateComment(event){
		console.log('UpdateComment: '+event.target.value)
		const value = event.target.value
		if (value.charAt(0) != '@'){
			this.setComment(value)
			return
		}

		if (this.state.showDropdown == true) { // already showing
			this.setComment(value)
			return
		}

		let toggleDropdown = document.getElementById('toggleDropdown')
		if (toggleDropdown == null)
			return

		toggleDropdown.click()
		this.setState({
			showDropdown: true
		})
	}

	setComment(text){
		let updated = Object.assign({}, this.state.comment)
		updated['text'] = text
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
			<div style={{padding:16, background:'#ffffe6', borderTop:'1px solid #ddd'}} className="dropdown">
				<input value={this.state.comment.text} onKeyUp={this.keyPress.bind(this)} onChange={this.updateComment.bind(this)} type="text" className="form-control" />			
				<a href="#" id='toggleDropdown' style={{display:'none'}} className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></a>
				<ul className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu1">
					<li style={style.listItem}><a href="#">Share</a></li>
					<li style={style.listItem}><a href="#">Share</a></li>
				</ul>
			</div>
		)
	}
}

export default CreateComment