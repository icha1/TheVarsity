import React, { Component } from 'react'

export default (props) => {

	return (
		<div className="entry clearfix" style={localStyle.container}>
			<div className="entry-timeline">
				+<span>Add</span>
				<div className="timeline-divider"></div>
			</div>
			<div className="entry-image">
				<div className="panel panel-default">
					<div className="panel-body">
						<input value={props.milestone.title} onChange={props.update.bind(this, 'title')} placeholder="Title" style={localStyle.input} type="text" />
						<textarea value={props.milestone.description} onChange={props.update.bind(this, 'description')} placeholder="Describe your milestone" style={localStyle.textarea}></textarea>
						<div style={{textAlign:'right', marginTop:12}}>
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