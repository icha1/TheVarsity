import React, { Component } from 'react'
import { Nav } from '../view'

class Home extends Component {
	render(){
		return (
			
			<div data-page="home" className="views pageview view view-main pages page navbar-fixed">
				<Nav />
				<div className="page-content hide-bars-on-scroll" >
				    <div data-pagination=".swiper-pagination" data-paginationHide="true" className="swiper-container largebanner swiper-init">

						Mobile Home Page !!
				    </div>
				</div>
			</div>

		)
	}
}

export default Home