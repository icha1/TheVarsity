import React, { Component } from 'react'
import Map from './Map'
import { connect } from 'react-redux'

class RightPanel extends Component {

	// componentWillMount(){
	// 	console.log('RightPanel: componentWillMount')
	// }

	// componentDidUpdate(){
	// 	console.log('RightPanel: componentDidUpdate')
	// }

	render(){
		const map = (this.props.session.showMap) ? <Map center={this.props.session.currentLocation} zoom={14} height={100} /> : null

		return (
			<div className="panel panel-right panel-reveal sidebar">
				{ map }
				
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		session: state.session
	}
}
export default connect(stateToProps)(RightPanel)