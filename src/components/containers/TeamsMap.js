import React, { Component } from 'react'
import { FirebaseManager } from '../../utils'
import actions from '../../actions/actions'
import { connect } from 'react-redux'
import { Map } from '../view'

class TeamsMap extends Component {
	constructor(){
		super()
		this.calculateDistance = this.calculateDistance.bind(this)
		this.fetchTeams = this.fetchTeams.bind(this)
		this.state = {
			zoom: 16

		}
	}

	componentDidMount(){
		if (this.props.session.currentDistrict.id != null)
			return

		const props = this.props
		const params = {
			limit: 5,
			lat: props.session.currentLocation.lat,
			lng: props.session.currentLocation.lng
		}

		props.fetchDistrict(params)
	}

	calculateDistance(location){
		const currentLocation = this.props.session.currentLocation
		const deltaX = currentLocation.lat-location.lat
		const deltaY = currentLocation.lng-location.lng
		var cSquared = (deltaY*deltaY) + (deltaX*deltaX)
		var dist = Math.sqrt(cSquared)
		return dist
	}

	locationChanged(location){
		const distance = this.calculateDistance(location)
		console.log('Distance: '+JSON.stringify(distance))

		if (distance < 0.01)
			return

		console.log('locationChanged: '+JSON.stringify(location))
		const props = this.props
		props.locationChanged(location)

		const params = {
			limit: 5, // nearby districts also
			lat: location.lat,
			lng: location.lng
		}

		props.fetchDistrict(params)
	}

	zoomChanged(zoom){
		this.setState({
			zoom: zoom
		})
	}

	fetchTeams(){
		if (this.props.session.currentDistrict.id == null)
			return null

		const district = this.props.session.currentDistrict.id

		if (this.props.session.teams == null){
			this.props.fetchTeams({district: district})
			return null
		}

		return this.props.session.teams
	}

	componentDidUpdate(){
		const district = this.props.session.currentDistrict.id
		if (district == null)
			return

		if (this.props.session.teams == null){
			this.props.fetchTeams({district: district})
			return
		}
	}

	render(){
		const markers = (this.state.zoom >= 15) ? this.props.session.teams : this.props.session.nearby
		return (
			<Map 
				center={this.props.session.currentLocation} 
				zoom={this.state.zoom} 
				animation={2}
				markers={ markers }
				mapZoomChanged={ this.zoomChanged.bind(this) }
				mapMoved={ this.locationChanged.bind(this) } />
		)
	}

}

const stateToProps = (state) => {
	return {
		session: state.session,
		user: state.account.currentUser
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchDistrict: (params) => dispatch(actions.fetchDistrict(params)),
		fetchTeams: params => dispatch(actions.fetchTeams(params)),
		commentsReceived: comments => dispatch(actions.commentsReceived(comments)),
		locationChanged: location => dispatch(actions.locationChanged(location))
	}
}
export default connect(stateToProps, mapDispatchToProps)(TeamsMap)
