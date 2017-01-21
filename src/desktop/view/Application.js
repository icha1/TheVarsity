import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import { Link } from 'react-router'
import { DateUtils, Alert } from '../../utils'
import styles from './styles'

class Application extends Component {
	constructor(){
		super()
		this.state = {
			application: {
				projects: {},
				coverletter: ''
			}
		}
	}


	updateApplication(field, event){
		event.preventDefault()
		let application = Object.assign({}, this.state.application)
		application[field] = event.target.value
		this.setState({
			application: application
		})
	}

	submitApplication(event){
		event.preventDefault()

		const user = this.props.user // shouldn't be null
		let updated = Object.assign({}, this.state.application)
		updated['from'] = {
			id: user.id,
			username: user.username
		}

		let projectsArray = []
		Object.keys(updated.projects).forEach((key, i) => {
			const project = updated.projects[key]
			if (project != null){
				projectsArray.push({
					id: project.id,
					title: project.title,
					text: project.text,
					image: project.image,
					images: project.images
				})
			}
		})

		updated['projects'] = projectsArray
		this.props.onSubmitApplication(updated)
	}

	addRemoveProject(project, event){
		event.preventDefault()
		let application = Object.assign({}, this.state.application)
		let projects = Object.assign({}, application.projects)
		if (projects[project.id])
			delete projects[project.id]
		else 
			projects[project.id] = project
		
		application['projects'] = projects
		this.setState({
			application: application
		})
	}

	render(){
		const post = this.state.post
		const user = this.props.user // shouldn't be null
		const projects = this.props.projects // can be null

		return (
			<div style={localStyle.container} className="hidden-xs">
				<h2 style={localStyle.title}>Apply</h2>
				<textarea onChange={this.updateApplication.bind(this, 'coverletter')} style={localStyle.textarea} placeholder="Coverletter (optional but recommended)"></textarea>

				<div className="content-wrap clearfix" style={{paddingTop:0, paddingBottom:0}}>
					<div className="col_half" style={{marginBottom:0}}>
						<h3 style={localStyle.title}>Add Projects</h3>
						{ (projects==null) ? null : projects.map((project, i) => {
								return (
									<div key={project.id} className="clearfix">
										<a target="_blank" href={'/post/'+project.slug}>
											<img style={localStyle.image} src={(project.image.indexOf('googleusercontent') == -1) ? project.image : project.image +'=s120-c'} />
										</a>
										<a target="_blank" href={'/post/'+project.slug}>
											{project.title}
										</a>
										<br />
										<a onClick={this.addRemoveProject.bind(this, project)} target="#">
											{ (this.state.application.projects[project.id]==null) ? <i style={{color:'green'}} className="icon-plus"></i> : <i style={{color:'red'}} className="icon-minus"></i> }
										</a>
									</div>
								)
							}) 
						}
					</div>

					<div className="col_half col_last" style={{marginBottom:0}}>
						<h3 style={localStyle.title}>Include Resume</h3>
					</div>
				</div>



				<div style={{textAlign:'right', marginTop:16}}>
					<a href="#" onClick={this.submitApplication.bind(this)} style={localStyle.btnSmall} className={localStyle.btnSmall.className}>Submit Application</a>
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
		height: 200,
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
		className: 'button button-mini button-border button-border-thin button-blue'
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
		width: 72,
		marginRight: 12,
		marginBottom: 12,
		float: 'left'
	},
	additionalImage: {
		width: 72,
		marginRight: 6,
		marginBottom: 4
	}
}

export default Application