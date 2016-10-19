import React, { Component } from 'react'
import { APIManager } from '../../utils'
import store from '../../stores/store'
import actions from '../../actions/actions'
import { connect } from 'react-redux'
import { Map } from '../view'

class Venues extends Component {

	componentDidMount(){

	}

	locationChanged(location){
		console.log('locationChanged: '+JSON.stringify(location))
		
	}

	render(){
		return (
			<Map center={this.props.location} zoom={16} mapMoved={this.locationChanged.bind(this)} />

		)
	}

}

const stateToProps = (state) => {
	return {
		location: state.locationReducer.currentLocation
	}
}

export default connect(stateToProps)(Venues)
