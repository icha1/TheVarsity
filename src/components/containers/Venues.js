import React, { Component } from 'react'
import { APIManager } from '../../utils'
import store from '../../stores/store'
import actions from '../../actions/actions'
import { connect } from 'react-redux'
import { Map } from '../view'

class Venues extends Component {
	constructor(){
		super()
		this.fetchVenues = this.fetchVenues.bind(this)
		this.state = {

		}
	}

	componentDidMount(){
		this.fetchVenues(this.props.currentLocation)
	}

	locationChanged(location){
//		console.log('locationChanged: '+JSON.stringify(location))
		this.fetchVenues(location)
	}

	fetchVenues(loc){
		APIManager.handleGet('/api/venue', loc, (err, response) => {
			if (err){
				alert(err)
				return
			}

			console.log('Venues: '+JSON.stringify(response.results))
		})
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
