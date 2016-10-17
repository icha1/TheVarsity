import React, { Component } from 'react'

class Nav extends Component {

	render(){
		return (
			<div id="page-menu">
				<div id="page-menu-wrap">
					<div className="container clearfix">
						<div className="menu-title">
							<a style={{color:'#fff'}} href="/">The Varsity</a>
						</div>
						<nav className="one-page-menu">
							<ul>
								<li><a href="#" data-href="#header"><div>Start</div></a></li>
								<li><a href="#" data-href="#section-about"><div>About</div></a></li>
							</ul>
						</nav>
						<div id="page-submenu-trigger"><i className="icon-reorder"></i></div>
					</div>
				</div>
			</div>
		)
	}
}


export default Nav