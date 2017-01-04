import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import constants from '../../constants/constants'
import { APIManager, DateUtils } from '../../utils'
import styles from './styles'

class CreatePost extends Component {
	constructor(){
		super()
		this.state = {
			isLoading: false,
			post: {
				title: '',
				text: '', 
				type: 'news', // event, news, etc.
				image: '',
				author: {}
			}
		}
	}

	updatePost(event){
		event.preventDefault()
		const value = event.target.value
		let updated = Object.assign({}, this.state.post)
		if (event.target.id != 'title'){
		    updated[event.target.id] = value
			this.setState({post: updated})
			return
		}

		// check if title is url
		const isUrl = (value.indexOf("http://") == 0 || value.indexOf("https://") == 0)
		if (isUrl == false){
	    	updated['title'] = value
			this.setState({post: updated})
			return
		}

//		console.log('SCRAPE = '+value)
		this.setState({isLoading: true})
		APIManager
		.handleGet('/tags', {url: value})
		.then((response) => {
			const tags = response.tags // title, image, description
			updated['title'] = tags.title
			updated['image'] = tags.image
			updated['text'] = tags.description
			updated['url'] = tags.url
			this.setState({
				isLoading: false,
				post: updated
			})
		})
		.catch((err) => {

		})
	}

	uploadImage(files){
		this.setState({isLoading: true})

		APIManager.upload(files[0], (err, image) => {
		this.setState({isLoading: false})
			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.post)
			updated['image'] = image.address
			this.setState({post: updated})
		})
	}

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	submitPost(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.post)
		this.props.submit(updated)
	}

	render(){
		const post = this.state.post
		let image = null
		if (post.image.length > 0)
			image = (post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s220-c'
		
		return (
			<div>
				<input id="title" value={post.title} onChange={this.updatePost.bind(this)} style={localStyle.input} type="text" placeholder="Title or URL" />
				<select style={localStyle.input} className="form-control" id="type" onChange={this.updatePost.bind(this)}>
					<option value="news">News</option>
					<option value="hiring">Hiring</option>
				</select>
				<textarea id="text" value={post.text} onChange={this.updatePost.bind(this)} style={localStyle.textarea} placeholder="Text"></textarea>

				<Dropzone onDrop={this.uploadImage.bind(this)} className="clearfix visible-md visible-lg">
					{ (post.image.length > 0) ? <div><img src={image} /><br />Click to Change</div> :
						<button className="social-icon si-small si-borderless si-instagram">
							<i className="icon-instagram"></i>
							<i className="icon-instagram"></i>
						</button>
					}

					<div style={{float:'right', width:50+'%'}}>
						{ (this.state.isLoading) ? <Loading type='bars' color='#333' /> : null }
					</div>
				</Dropzone>

	            <a href="#" onClick={this.submitPost.bind(this)} className="button button-circle" style={localStyle.btnBlue}>Submit</a>
	            <br />
			</div>
		)
	}
}

const localStyle = {
	btnBlue: {
		float: 'right',
		className: 'button button-small button-circle button-blue'
	},
	input: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	textarea: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 16,
		border: 'none',
		width: 100+'%',
		fontFamily:'Pathway Gothic One',
		minHeight: 220
	}
}

export default CreatePost