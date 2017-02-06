import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils, TextUtils } from '../../utils'
import styles from './styles'

export default (props) => {
	const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const milestone = props

	let dateParts = milestone.timestamp.split('T')
	dateParts = dateParts[0].split('-') // 2017-01-28
	const day = dateParts[dateParts.length-1]
	const month = dateParts[1]

	const maxWidth = props.maxWidth || 560
	const withIcon = props.withIcon || false
	const mode = props.mode || 'standard'

	const path = '/project/'+milestone.project.slug
	const renderHtml = props.renderHtml || false

	let content = null
	if (mode == 'standard'){
		content = (
			<div id={milestone.id} className="entry clearfix" style={{border:'none', marginBottom:12, paddingBottom:12, maxWidth:maxWidth}}>
				<div className="entry-timeline" style={ (withIcon) ? {backgroundSize:'cover', background:'url("'+milestone.project.image+'=s72-c") no-repeat center'} : null}>
					{ (withIcon) ? <div className="timeline-divider"></div> : 
						<div>
							{ months[parseInt(month)] }<span>{ day }</span>
							<div className="timeline-divider"></div>
						</div>
					}
				</div>
				<div className="entry-image">
					<div className="panel panel-default">
						<div className="panel-body">
							<Link to={path}>
								<h3 style={localStyle.title}>{milestone.title}</h3>
								{ (renderHtml) ? null : <p style={{marginTop:0, marginBottom:6}}>{milestone.description}</p> }
							</Link>
							{ (renderHtml) ? <p style={{marginTop:0, marginBottom:6}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(milestone.description)}}></p> : null }

							<div style={{textAlign:'right'}}>
								<Link style={{fontWeight:100}} to={'/profile/'+milestone.profile.slug}>
									{ milestone.profile.username }
								</Link>
							</div>

							{ milestone.attachments.map((file, i) => {
									if (file.mime == 'video'){
										return (
											<div key={i}>
												<video width="320" height="240" controls>
												  <source src={file.address} type="video/mp4" />
													Your browser does not support the video tag.
												</video>
												<br />
												<a style={{color:'red'}} href={file.address}>{file.name}</a>
											</div>
										)
									}
								})
							}

							{ (milestone.attachments.length == 0) ? null : <div><hr /><h4 style={localStyle.title}>Attachments</h4></div>}
							<ol style={{paddingLeft:16}}>
								{ milestone.attachments.map((file, i) => {
										return <li key={i}><a style={{color:'red', marginRight:6}} target="_blank" href={file.address}>{file.name}</a>({file.mime})</li>
									})
								}
							</ol>

						</div>

						<div style={{borderTop:'1px solid #ddd'}}>
							{ milestone.comments.map((comment, i) => {
									return (
										<div key={i} style={localStyle.comment}>
											{ comment.text }

											<div style={{textAlign:'right'}}>
												<Link style={{fontWeight:100}} to={'/profile/'+comment.user.slug}>
													{ comment.user.username }
												</Link>
											</div>

										</div>
									)
								})

							}

							<input onKeyPress={props.submitComment.bind(this, milestone)} style={localStyle.input} type="text" placeholder="Enter Comment" />
						</div>
					</div>
				</div>
			</div>
		)
	}
	else if (mode == 'feed') {
		content = (
			<div style={{borderBottom:'1px dotted #ddd', marginBottom:16}}>
				<Link to={path}>
					<h4 style={localStyle.title}>{milestone.title}</h4>
					<div className="col_three_fourth" style={{paddingBottom:0, marginBottom:12}}>
						<p style={localStyle.paragraph}>
							{TextUtils.truncateText(milestone.description, 100)}
						</p>
					</div>
					<div className="col_one_fourth col_last" style={{paddingBottom:0, marginBottom:12, textAlign:'right'}}>
						<img style={{width:72, background:'#fff', padding:3, border:'1px solid #ddd'}} src={milestone.project.image+'=s140-c'} />
					</div>
				</Link>

				<div style={{textAlign:'right', marginBottom:12, marginTop:24}}>
					<span style={localStyle.detail}>
						<Link style={{color:'#005999'}} to={'/profile/'+milestone.profile.slug}>{ milestone.profile.username }</Link>
					</span>
					<span style={localStyle.detail}>|</span>
					<span style={localStyle.detail}>
						<Link style={{color:'#009959'}} to={'/project/'+milestone.project.slug}>{ milestone.project.title }</Link>
					</span>
					<span style={localStyle.detail}>|</span>
					<span style={localStyle.detail}>Feb 1</span>
				</div>
			</div>
		)
	}

	return <div>{content}</div>
}

const localStyle = {
	icon: {
		float: 'left',
		width: 36,
		borderRadius: 18,
		marginRight: 12
	},
	comment:{
		background:'#f9f9f9', 
		padding:12, 
		fontWeight:100, 
		borderBottom:'1px solid #ddd'
	},
	container: {
		border:'none',
		marginBottom:12,
		paddingBottom:12,
		maxWidth:560
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	},
	detail: {
		marginLeft:12,
		fontWeight:100
	},
	input: {
		color:'#333',
		background: '#fff',
		marginBottom: 0,
		padding: 12,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	}	
}