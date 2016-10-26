import React, { Component } from 'react'
import styles from './styles'

class Nav extends Component {

	showLogin(event){
		event.preventDefault()
		console.log('showLogin')

	}

	render(){
		const style = styles.nav

		return (
			<div id="page-menu">
				<div id="page-menu-wrap">
					<div className="container clearfix">
						<div className="menu-title">
							<a style={style.title} href="/">The Varsity</a>
						</div>
						<nav className="one-page-menu">
							<ul style={style.ul}>
								<li><a href="#"><div>About</div></a></li>
								<li><a href="#"><div>Join</div></a></li>
								<li><a onClick={this.showLogin.bind(this)} href="#"><div>Login</div></a></li>
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