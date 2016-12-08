import React, { Component } from 'react'

class Nav extends Component {
	render(){
		return (
			<div className="navbar">
				<div className="navbar-inner">
				    <div className="left sliding">
				    	<a href="#" data-panel="left" className="open-panel link icon-only"><i className="fa fa-bars"></i></a>
				    </div>
				    <div className="center">MaxSmart</div>
				    <div className="right sliding">
				    	<a href="#"  data-panel="right" className="open-panel link icon-only">
				    		<i className="fa fa-envelope"></i>
				    	</a>
				    </div>
				</div>
			</div>
		)
	}
}

export default Nav