import React, { Component } from 'react'

export default (props) => {

	const context = content[props.context.toLowerCase()]
	return (
		<div className="col_full col_last">
			<div style={localStyle.container}>
				<h3 style={localStyle.title}>What</h3>
				<p style={localStyle.paragraph}>
					{ context['what'] }
				</p>

				<hr />

				<h3 style={localStyle.title}>Why</h3>
				<p style={localStyle.paragraph}>
					{ context['why'] }
				</p>

				<br />
				{ (context['showButton']) ? <a href="#" onClick={props.btnAction.bind(this)} className={localStyle.btnSmall.className}>Get Started</a> : null }
			</div>
		</div>

	)
}

const content = {
	paragraph: {
		marginTop: 0,
		marginBottom:24
	},
	hiring: {
		what: '',
		why: '',
		showButton: false
	},
	showcase: {
		what: 'This showcase is an area for displaying your work and getting feedback, suggestions, and general opinions. If you are working on a side project and would like to get show it to the team, this is the spot.',
		why: 'Projects in the showcase can be viewed by anyone so it is a good area for displaying your overall skills and abilities. Top rated showcase projects are periodically sent to hiring companies via newsletter.',
		showButton: true
	}
}

const localStyle = {
	container: {
		fontWeight:100,
		border:'1px solid #ddd',
		padding:24,
		fontSize:16
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	},
	btnSmall: {
		float:'right',
		marginTop:0,
		className: 'button button-small button-border button-border-thin button-blue'
	}
}