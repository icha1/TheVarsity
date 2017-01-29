import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import { APIManager, DateUtils, Alert } from '../../utils'
import styles from './styles'

class CreateProject extends Component {
	constructor(){
		super()
		this.state = {
			post: {
				title: '',
				type: 'project',
				url: '',
				image: '',
				images: [],
				teams: {},
				text: ''
			}
		}
	}

	componentDidMount(){
		if (this.props.team == null)
			return

		let updated = Object.assign({}, this.state.post)
		let teams = Object.assign({}, updated.teams)
		teams[this.props.team.id] = this.props.team
		updated['teams'] = teams

		this.setState({
			post: updated
		})
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
		const errorMsg = {
				title:'Oops',
				text: '',
				type: 'error',
				confirmButtonText: 'Got it'
		}

		if (this.state.post.title.length == 0){
			errorMsg['text'] = 'Please enter a title for your project.'
			Alert.showAlert(errorMsg)
			return
		}

		if (this.state.post.image.length == 0){
			errorMsg['text'] = 'Please Include an Image for your project.'
			Alert.showAlert(errorMsg)
			return
		}

		if (this.state.post.text.length == 0){
			errorMsg['text'] = 'Please Enter a Description For Your Project.'
			Alert.showAlert(errorMsg)
			return
		}

		const keys = Object.keys(this.state.post.teams)
		if (keys.length == 0){
			errorMsg['text'] = 'Please Add At Least One Team to Display Your Project.'
			Alert.showAlert(errorMsg)
			return			
		}

		let updated = Object.assign({}, this.state.post)
		updated['teams'] = keys // just need array of team ID's


		this.props.onCreate('project', updated, true)
	}

	addRemoveTeam(team, event){
		event.preventDefault()
//		console.log('addRemoveTeam: '+event.target.id)
		let post = Object.assign({}, this.state.post)
		let teams = Object.assign({}, post.teams)
		if (teams[team.id])
			delete teams[team.id]
		else 
			teams[team.id] = team
		
		post['teams'] = teams
		this.setState({
			post: post
		})
	}

	render(){
		const post = this.state.post

		return (
			<div style={localStyle.container} className="hidden-xs">
				<h2 style={localStyle.title}>Create Project</h2>
				<input onChange={this.updatePost.bind(this, 'title')} style={localStyle.input} type="text" placeholder="Title" /><br />
				<input onChange={this.updatePost.bind(this, 'url')} style={localStyle.input} type="text" placeholder="URL (optional)" /><br />
				<textarea onChange={this.updatePost.bind(this, 'text')} style={localStyle.textarea} placeholder="Description"></textarea>

				<div className="container clearfix" style={{padding:0, margin:0}}>
					<div className="col_one_third" style={{marginBottom:0}}>
						<h3 style={localStyle.title}>Primary Image</h3>
						<Dropzone style={{border:'none', marginTop: 6}} onDrop={this.uploadImage.bind(this, 'main')}>
							<img style={localStyle.image} src={ (post.image.length > 0) ? post.image+'=s220-c' : '/images/image-placeholder.png' } />
							<br />
							<span style={{fontWeight:100, fontSize:12, marginRight:6}}>Click to Change</span>
						</Dropzone>
					</div>

					<div className="col_two_third col_last" style={{marginBottom:0}}>
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
				</div>

				{ (this.props.teams == null) ? null : 
					<div className="container clearfix" style={{padding:0, margin:0}}>
						<hr />
						<h3 style={localStyle.title}>Teams</h3>
						<p style={localStyle.paragraph}>Select the teams on which this project will be seen (Click Icon to Select):</p>

						{ this.props.teams.map((team, i) => {
								const checked = (this.state.post.teams[team.id] == null) ? false : true
								return (
									<div key={team.id} className="col_one_fourth" style={{marginBottom:0}}>
										<a target="_blank" onClick={this.addRemoveTeam.bind(this, team)} href="#">
											<img style={localStyle.teamImage} src={(team.image.indexOf('googleusercontent') == -1) ? team.image : team.image +'=s120-c'} />
										</a>
										<br />
										<input id={team.id} checked={checked} type="checkbox" style={{marginRight:6}} />
										<a target="_blank" href={'/team/'+team.slug}>
											{team.name}
										</a>
									</div>
								)
							})
						}

					</div>
				}

				<div style={{textAlign:'right', marginTop:16}}>
					<a href="#" onClick={this.createProject.bind(this)} style={localStyle.btnSmall} className={localStyle.btnSmall.className}>Create Project</a>
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
		color:'#333',
		fontWeight: 100,
		marginBottom: 24
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
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
	teamImage: {
		padding: 3,
		background: '#fff',
		border: '1px solid #ddd',
		width: 72,
		marginRight: 12
	},
	additionalImage: {
		width: 72,
		marginRight: 6,
		marginBottom: 4,
		paddingBottom: 0
	}
}

export default CreateProject