import React, { Component } from 'react'
import { Feed, MapNavigation, District, ProfileList } from '../containers'
import styles from './styles'

class Home extends Component {
	render(){
		const style = styles.home

		return ( 
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<MapNavigation />
						<District />
		            </div>
				</header>

				<section id="content" style={style.content}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
							<Feed />
						</div>

						<div className="col_one_third col_last">
							<ProfileList />
						</div>

					</div>
				</section>
			</div>
		)
	}
}

export default Home
