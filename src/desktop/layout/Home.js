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


