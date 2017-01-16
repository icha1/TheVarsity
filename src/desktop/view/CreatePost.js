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
			loading: {
				main: false,
				additional: false
			},
			mode: 'create', // create or edit
			post: {
				title: '',
				text: '', 
				type: 'news', // event, news, etc.
				image: '',
				author: {}
			}
		}
	}

	componentWillMount(){
		if (this.props.post == null)
			return

		// if props.post, this is editing mode
		const updated = Object.assign({}, this.props.post)
		this.setState({
			post: updated,
			mode: 'edit'
		})
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

	toggleLoading(type, isLoading){
		let loading = Object.assign({}, this.state.loading)
		loading[type] = isLoading
		this.setState({loading: loading})
	}

	uploadImage(type, files){
		this.toggleLoading(type, true)
		APIManager.upload(files[0], (err, image) => {
			this.toggleLoading(type, false)

			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.post)
			if (type == 'main')
				updated['image'] = image.address

			if (type == 'additional'){
				let array = Object.assign([], updated['images'])
				array.push(image.address)
				updated['images'] = array
			}

			this.setState({post: updated})
		})
	}

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	submitPost(event){
		event.preventDefault()
		if (this.state.post.title.length == 0){
			alert('Please enter a title.')
			return
		}

		if (this.state.post.text.length == 0){
			alert('Please enter text for your post.')
			return
		}

		let updated = Object.assign({}, this.state.post)
		this.props.submit(updated)
	}

	removeImage(image, event){
		event.preventDefault()
//		console.log('removeImage: '+image)

		let array = []
		this.state.post.images.forEach((additionalImage, i) => {
			if (additionalImage != image)
				array.push(additionalImage)
		})

		let updated = Object.assign([], this.state.post)
		updated['images'] = array
		this.setState({
			post: updated
		})
	}

	render(){
		const post = this.state.post 
		let image = null
		if (post.image.length > 0)
			image = (post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s90-c'
		
		return (
			<div>
				<div style={{background:'#f9f9f9', marginBottom:36}}>
					<div className="row">
						<div className="col-md-9">
							<div style={{padding:12}}>
								<input id="title" value={post.title} onChange={this.updatePost.bind(this)} style={localStyle.input} type="text" placeholder="Title or URL" />
								<textarea id="text" value={post.text} onChange={this.updatePost.bind(this)} style={localStyle.textarea} placeholder="Text"></textarea>
							</div>
						</div>
						<div className="col-md-3">
							<div style={{padding:12, textAlign:'right'}}>
								{ (this.state.loading.main) ? <Loading type='bars' color='#333' /> : null }
								{ (post.image.length > 0) ? <img src={image} /> : null }
							</div>
						</div>
					</div>

					<div style={{minHeight:36, borderTop:'1px solid #ddd'}}>
						<div className="col_half">
							<Dropzone onDrop={this.uploadImage.bind(this, 'main')} className="visible-md visible-lg">
								<button style={{borderRadius:0, height:35}} className="social-icon si-small si-borderless si-instagram">
									<i className="icon-instagram"></i>
									<i className="icon-instagram"></i>
								</button>
							</Dropzone>
						</div>

						<div className="col_one_fourth" style={{textAlign:'center', background:'#ddd'}}>
							{ (this.state.mode == 'create') ? null : <button onClick={this.cancel.bind(this)} style={{height:35, border:'none', background:'#ddd'}}>Cancel</button> }
						</div>

						<div className="col_one_fourth col_last" style={{textAlign:'center', background:'#ddd'}}>
				            <button onClick={this.submitPost.bind(this)} style={{height:35, border:'none', background:'#ddd'}}>{ (this.state.mode == 'create') ? 'Submit Post' : 'Update'}</button>
						</div>
					</div>
				</div>

				{ (this.state.mode == 'create') ? null : (
						<div className="row">
							<div className="col-md-12">
								<div style={{padding:12, background:'#f9f9f9', textAlign:'left', minHeight: 64}}>
									<Dropzone onDrop={this.uploadImage.bind(this, 'additional')} className="visible-md visible-lg">
										To Add More Images, <button className="button button-mini button-circle button-blue">Click Here</button>
									</Dropzone>
									<br /><br />
									{ post.images.map((additionalImage, i) => {
											return (
												<div key={i} style={{display:'inline-block'}}>
													<img style={{marginRight:12}} src={additionalImage+'=s72-c'} />
													<br />
													<a onClick={this.removeImage.bind(this, additionalImage)} style={{color:'red'}} href="#">Remove</a>
												</div>
											)
										})
									}
									{ (this.state.loading.additional) ? <Loading type='bars' color='#333' /> : null }
								

								</div>
							</div>
						</div>
					)
				}
			</div>
		)
	}
}

const localStyle = {
	btnBlue: {
		className: 'button button-small button-circle button-blue'
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
		minHeight: 72,
		resize: 'none'
	}
}

export default CreatePost