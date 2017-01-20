import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import { APIManager, DateUtils } from '../../utils'
import styles from './styles'

class CreateProject extends Component {
	constructor(){
		super()
		this.state = {
			post: {
				title: '',
				url: '',
				image: '',
				images: [],
				text: ''
			}
		}
	}

	uploadImage(type, files){
		APIManager.upload(files[0], (err, image) => {
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

	updatePost(field, event){
		let updated = Object.assign({}, this.state.post)
		updated[field] = event.target.value
		this.setState({
			post: updated
		})
	}

	createProject(event){
		event.preventDefault()
		this.props.onCreate(this.state.post)
	}

	render(){
		const post = this.state.post

		return (
			<div style={localStyle.container} className="hidden-xs">
				<h2 style={localStyle.title}>Create Project</h2>
				<input onChange={this.updatePost.bind(this, 'title')} style={localStyle.input} type="text" placeholder="Title" /><br />
				<input onChange={this.updatePost.bind(this, 'url')} style={localStyle.input} type="text" placeholder="URL (optional)" /><br />
				<textarea onChange={this.updatePost.bind(this, 'text')} style={localStyle.textarea} placeholder="Description"></textarea>

				<div className="col_one_third">
					<h3 style={localStyle.title}>Primary Image</h3>
					<Dropzone style={{border:'none', marginTop: 6}} onDrop={this.uploadImage.bind(this, 'main')}>
						<img style={localStyle.image} src={ (post.image.length > 0) ? post.image+'=s220-c' : '/images/image-placeholder.png' } />
						<br />
						<span style={{fontWeight:100, fontSize:12, marginRight:6}}>Click to Change</span>
					</Dropzone>
				</div>

				<div className="col_two_third col_last">
					<h3 style={localStyle.title}>Additional Images (optional)</h3>
					<div style={localStyle.imageContainer}>

						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 1) ? '/images/image-placeholder.png' : post.images[0]+'=s120-c' } />
						</Dropzone>

						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 2) ? '/images/image-placeholder.png' : post.images[1]+'=s120-c' } />
						</Dropzone>

						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 3) ? '/images/image-placeholder.png' : post.images[2]+'=s120-c' } />
						</Dropzone>

						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 4) ? '/images/image-placeholder.png' : post.images[3]+'=s120-c' } />
						</Dropzone>

						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 5) ? '/images/image-placeholder.png' : post.images[4]+'=s120-c' } />
						</Dropzone>

						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 6) ? '/images/image-placeholder.png' : post.images[5]+'=s120-c' } />
						</Dropzone>

						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 7) ? '/images/image-placeholder.png' : post.images[6]+'=s120-c' } />
						</Dropzone>
						
						<Dropzone className="col_one_fourth" style={localStyle.additionalImage} onDrop={this.uploadImage.bind(this, 'additional')}>
							<img style={localStyle.additionalImage} src={ (post.images.length < 8) ? '/images/image-placeholder.png' : post.images[7]+'=s120-c' } />
						</Dropzone>

					</div>
				</div>
				<div style={{textAlign:'right', marginTop:16}}>
					<a href="#" onClick={this.createProject.bind(this)} style={localStyle.btnSmall} className={localStyle.btnSmall.className}>Create</a>
				</div>
			</div>
		)


	}
}

const localStyle = {
	container: {
		fontWeight:100,
		border:'1px solid #ddd',
		padding:24,
		fontSize:16,
		textAlign: 'left'
	},
	input: {
		width: 100+'%',
		border: 'none',
		padding: 6,
		marginBottom: 12,
		borderBottom: '1px solid #ededed',
		fontFamily:'Pathway Gothic One',
	},
	textarea: {
		width: 100+'%',
		height: 160,
		padding: 6,
		background: '#f9f9f9',
		border: 'none',
		resize: 'none',
		fontWeight: 100,
		marginBottom: 16
	},
	paragraph: {
		marginTop: 0,
		marginBottom:24
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100
	},
	btnSmall: {
		marginTop: 0,
		marginRight: 0,
		className: 'button button-small button-border button-border-thin button-blue'
	},
	imageContainer: {
		border:'none',
		marginTop:6,
		background:'#fff', 
		height: 140,
		padding:0
	},
	image: {
		padding: 3,
		background: '#fff',
		border: '1px solid #ddd',
		width: 150
	},
	additionalImage: {
		width: 72,
		marginRight: 6,
		marginBottom: 4
	}
}

export default CreateProject