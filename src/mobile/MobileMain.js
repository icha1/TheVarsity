import React, { Component } from 'react'
import Loader from 'react-loader'
import { connect } from 'react-redux'

class MobileMain extends Component {

	componentDidMount(){
		console.log('MobileMain: ComponentDidMount')
	}

	render(){
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
}

export default MobileMain
