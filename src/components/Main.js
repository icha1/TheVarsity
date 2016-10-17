import React, { Component } from 'react'
import { Nav } from './view'

class Main extends Component {
	render(){
		return (
			<div className="stretched side-header">
				<Nav />
				<div id="wrapper">
					{this.props.children}
				</div>

			</div>
		)
	}
}

export default Main
