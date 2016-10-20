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
		if (this.props.venues.length == 0)
			this.fetchVenues(this.props.currentLocation)
	}

	locationChanged(location){
		console.log('locationChanged: '+JSON.stringify(location))
		this.fetchVenues(location)
	}

	fetchVenues(loc){
		APIManager.handleGet('/api/venue', loc, (err, response) => {
			if (err){
				alert(err)
				return
			}

//			console.log('Venues: '+JSON.stringify(response.results))
			store.currentStore().dispatch(actions.venuesReceived(response.results))
		})
	}

	render(){
		return (
			<Map 
				center={this.props.location} 
				zoom={16} 
				markers={this.props.venues}
				mapMoved={this.locationChanged.bind(this)} />
		)
	}

}

const stateToProps = (state) => {
	return {
		location: state.location.currentLocation,
		venues: state.venue.list
	}
}

export default connect(stateToProps)(Venues)
