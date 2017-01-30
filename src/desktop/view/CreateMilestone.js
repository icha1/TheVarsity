import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/

export default (props) => {

	const milestone = props.milestone
	return (
		<div className="entry clearfix" style={localStyle.container}>
			<div className="entry-timeline">
				+<span>Add</span>
				<div className="timeline-divider"></div>
			</div>
			<div className="entry-image">
				<div className="panel panel-default">
					<div className="panel-body">
						<input value={milestone.title} onChange={props.update.bind(this, 'title')} placeholder="Title" style={localStyle.input} type="text" />
						<textarea value={milestone.description} onChange={props.update.bind(this, 'description')} placeholder="Describe your milestone" style={localStyle.textarea}></textarea>
						<div style={{textAlign:'right', marginTop:12}}>
							<div style={{textAlign:'left'}}>
								<Dropzone onDrop={props.uploadFile.bind(this)} style={{border:'none'}}>
									<button style={{marginRight: 6}}>Add File</button>
									(Image, video, audio or .zip files)<br />
								</Dropzone>
								{ (props.loading == true) ? <Loading type='bars' color='#333' /> : null }
								<ol style={{paddingLeft:16, marginTop:6}}>
									{ milestone.attachments.map((file, i) => {
											return <li key={i}><a style={{color:'red'}} target="_blank" href={file.address}>{file.name}</a></li>
										})
									}
								</ol>
							</div>

							<button onClick={props.submitMilestone.bind(this)} className={localStyle.btn.className}>Add Milestone</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const localStyle = {
	btn: {
		className: 'button button-small button-border button-border-thin button-blue'
	},
	container: {
		border:'none',
		marginBottom:12,
		paddingBottom:12,
		maxWidth:560
	},
	input: {
		width:100+'%',
		border:'none',
		background:'#f9f9f9',
		padding:6
	},
	textarea: {
		width:100+'%',
		height:80,
		border:'none',
		background:'#f9f9f9',
		padding:6,
		marginTop:12
	}


}