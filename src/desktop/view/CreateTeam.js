import React, { Component } from 'react'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import Dropzone from 'react-dropzone'
import { APIManager, DateUtils } from '../../utils'
import styles from './styles'

class CreateTeam extends Component {
	constructor(){
		super()
		this.state = {
			isLoading: false,
			team: {
				name: '',
				type: 'software',
				description: '',
				// street: '',
				image: '',
			}
		}
	}

	uploadImage(files){
		this.setState({
			isLoading: true
		})

		APIManager.upload(files[0], (err, image) => {
			this.setState({
				isLoading: false
			})

			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.team)
			updated['image'] = image.address
			this.setState({team: updated})
		})
	}	

	updateTeam(event){
		let updated = Object.assign({}, this.state.team)
		updated[event.target.id] = event.target.value
		this.setState({
			team: updated
		})
	}

	submitTeam(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.team)
		if (updated.name.length == 0){
			alert('Please enter a team name.')
			return
		}

		if (updated.name.description == 0){
			alert('Please enter a team description.')
			return
		}

		if (updated.otherCategory != null)
			updated['type'] = updated.otherCategory

		if (updated.image.length == 0) // defer to default if no image specified
			delete updated['image']

		this.props.submit(updated)
	}

	cancel(event){
		event.preventDefault()
		this.props.cancel()
	}

	render(){
		const team = this.state.team
		const image = (team.image.length == 0) ? '/images/image-placeholder.png' : team.image+'=s220-c'
		const icon = (team.image.length == 0) ? '/images/profile-icon.png' : team.image+'=s120-c'

		return (
			<div>
				<div className={localStyle.container.className} style={localStyle.container}>
					<div className="comment-meta">
						<div className="comment-author vcard">
							<span className="comment-avatar clearfix">
							<img alt='The Varsity' src={icon} className='avatar avatar-60 photo' height='60' width='60' /></span>
						</div>
					</div>

					<div className={styles.post.content.className} style={styles.post.content}>
						<div className="col_two_third" style={{marginBottom:4}}>
							<input id="name" onChange={this.updateTeam.bind(this)} type="text" placeholder="Team Name" style={localStyle.input} /><br />
							<textarea id="description" onChange={this.updateTeam.bind(this)} placeholder="Description" style={styles.post.textarea}></textarea><br />					
						</div>

						<Dropzone onDrop={this.uploadImage.bind(this)} className="col_one_third col_last" style={{marginBottom:4, textAlign:'right'}}>
							<img style={styles.image} src={image} />
							<div style={{float:'right', width:50+'%'}}>
								{ (this.state.isLoading) ? <Loading type='bars' color='#333' /> : null }
							</div>
						</Dropzone>
					</div>
				</div>
				<br />
				<label>Category</label>
				<select style={{border:'1px solid #ddd'}} className="form-control" id="type" onChange={this.updateTeam.bind(this)}>
					<option value="software">Software</option>
					<option value="graphic design">Graphic Design</option>
					<option value="photography">Photography</option>
					<option value="videography">Videography</option>
					<option value="fashion">Fashion</option>
					<option value="social media">Social Media Marketing</option>
					<option value="real estate">Real Estate</option>
					<option value="entertainment">Entertainment</option>
					<option value="legal">Legal</option>
					<option value="personal training">Personal Training</option>
					<option value="other">Other (enter below)</option>
				</select>
				{ (this.state.team.type == 'other') ? <input id="otherCategory" onChange={this.updateTeam.bind(this)} type="text" placeholder="Category" className="form-control" style={{marginTop:16, border:'1px solid #ddd'}} /> : null}
				<br />
				<a href="#" onClick={this.submitTeam.bind(this)} style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Create</a>
			</div>
		)
	}
}

const localStyle = {
	container: {
		background: '#fff',
		className: 'comment-wrap clearfix',
		paddingLeft: 48
	},
	input: {
		color:'#333',
		fontWeight: 200,
	    lineHeight: 1.5,
	    fontSize: 30,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%',
		marginTop: 0
	}	
}

export default CreateTeam