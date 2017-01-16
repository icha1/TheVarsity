import React, { Component } from 'react'
import { FeaturedTeams, Section } from '../containers'
import { Redeem } from '../view'
import styles from './styles'

export default (props) => {
	const style = styles.home

	return ( 
		<div className="clearfix">
			<header id="header" className="no-sticky hidden-xs" style={{background:'#f9f9f9'}}>
	            <div id="header-wrap">

					<div className="container clearfix">
						<div style={{paddingTop:96}}></div>
						<FeaturedTeams />
		            </div>

	            </div>
			</header>

			<Section content="header" />
			<Section content="about" />
			<Section content="advantage" />
		    <Section content="redeem" />
		</div>
	)
}

const localStyle = {
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
	inputWhite: {
		color:'#333',
		background: '#fff',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	image: {
		background: '#fff', 
		border: '1px solid #ddd',
		padding: 3,
		marginBottom: 16
	},
	titleWhite: {
		color:'#fff',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		borderBottom: '2px solid #fff'
	}
}

