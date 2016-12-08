import React, { Component } from 'react'
import Loader from 'react-loader'
import { connect } from 'react-redux'
import { LeftPanel, RightPanel } from './view'

class MobileMain extends Component {

	componentDidMount(){
		console.log('MobileMain: ComponentDidMount')
	}

	render(){

		return (
			<div>
				<div className="statusbar-overlay"></div>
				<div className="panel-overlay"></div>
			
				<LeftPanel />
				<RightPanel />
				{this.props.children}
			</div>
		)
	}
}

export default MobileMain
