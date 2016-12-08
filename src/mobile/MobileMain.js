import React, { Component } from 'react'
import Loader from 'react-loader'
import { connect } from 'react-redux'

class MobileMain extends Component {

	render(){
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
}

export default MobileMain
