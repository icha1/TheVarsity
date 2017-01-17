import React, { Component } from 'react'
import { TextUtils } from '../../utils'
import styles from './styles'

export default (props) => {

	return (
        <div id="header-wrap">
			<div className="container clearfix">
				<div style={{paddingTop:96}}></div>
				<div>
					<h2 style={localStyle.title}>{ props.name }</h2>
					<span style={styles.paragraph}>{ TextUtils.capitalize(props.type) }</span>
					<hr />

					<nav>
						<ul style={{listStyleType:'none'}}>
							{ props.menuItems.map((item, i) => {
									const itemStyle = (item == props.selected) ? localStyle.selected : localStyle.menuItem
									return (
										<li style={{marginTop:0}} key={item}>
											<div style={itemStyle}>
												<a onClick={props.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
											</div>
										</li>
									)
								})
							}
						</ul>
					</nav>

				</div>
            </div>
        </div>
	)
}

const localStyle = {
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	},
	selected: {
		padding: '6px 6px 6px 16px',
		background: '#f9f9f9',
		borderRadius: 2,
		borderLeft: '3px solid rgb(91, 192, 222)',
		fontSize: 16,
		fontWeight: 400
	},
	menuItem: {
		padding: '6px 6px 6px 16px',
		background: '#fff',
		borderLeft: '3px solid #ddd',
		fontSize: 16,
		fontWeight: 100

	}	
}