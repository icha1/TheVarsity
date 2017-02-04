import React, { Component } from 'react'
import { BaseContainer, FeaturedProjects, Section } from '../containers'
import styles from './styles'

export default (props) => {

	return ( 
		<div className="clearfix">
			<header id="header" className="no-sticky hidden-xs" style={{background:'#f9f9f9'}}>
	            <div id="header-wrap">

					<div className="container clearfix">
						<div style={{paddingTop:96}}></div>
						<FeaturedProjects />
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


