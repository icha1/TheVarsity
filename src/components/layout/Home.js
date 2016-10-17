import React, { Component } from 'react'
import { Posts } from '../containers'
import { Map } from '../view'
import styles from './styles'

class Home extends Component {
	render(){
		const style = styles.home
		return ( 
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<Map />
		            </div>
				</header>

				<section id="content" style={style.content}>
					<Posts />
				</section>
			</div>
		)
	}
}

export default Home
