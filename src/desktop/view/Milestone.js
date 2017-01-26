import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils } from '../../utils'
import styles from './styles'

export default (props) => {

	return (
		<div className="entry clearfix" style={{border:'none', marginBottom:12, paddingBottom:12, maxWidth:560}}>
			<div className="entry-timeline">
				21<span>Mar</span>
				<div className="timeline-divider"></div>
			</div>
			<div className="entry-image">
				<div className="panel panel-default">
					<div className="panel-body">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia, fuga optio voluptatibus saepe tenetur aliquam debitis eos accusantium! Vitae, hic, atque aliquid repellendus accusantium laudantium minus eaque quibusdam ratione sapiente.
					</div>
				</div>
			</div>
		</div>
	)
}
