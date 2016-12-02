import React, { Component } from 'react'
import { FirebaseManager } from '../../utils'
import actions from '../../actions/actions'
import { connect } from 'react-redux'
import { Map } from '../view'
import { browserHistory } from 'react-router'

class MapNavigation extends Component {
	constructor(){
		super()
		this.calculateDistance = this.calculateDistance.bind(this)
		this.fetchTeams = this.fetchTeams.bind(this)
		this.connectToFirebase = this.connectToFirebase.bind(this)
		this.state = {
			zoom: 16,
			connected: false,
			currentMembers: null
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

		const range = (this.state.zoom >= 16) ? 50 : 600 // make this value dependent on map zoom level
		const params = {
//			range: 50,
			range: range, 
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

	markerClicked(marker, map){
		console.log('markerClicked: '+marker.slug+', '+marker.schema)
		if (marker.schema == 'team'){
			browserHistory.push('/team/' + marker.slug)
			return
		}

		if (marker.schema == 'district'){
			const markerLoc = marker.position
			const delta = .003 // this is about a zoom level of 16
//			console.log('ZOOM IN: '+JSON.stringify(markerLoc))

			map.fitBounds({
				north: markerLoc.lat+delta,
				east: markerLoc.lng+delta,
				south: markerLoc.lat-delta,
				west: markerLoc.lng-delta
			})
			return
		}
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
		if (district == null){
			return
		}

		if (this.props.session.teams == null){
			this.props.fetchTeams({district: district})
			return
		}

		if (this.state.connected){
			console.log('DISTRICT: '+JSON.stringify(district))
			return
		}

		window.onbeforeunload = () => {
			if (this.props.user == null)
				return

			console.log('BYE')
			const district = this.props.session.currentDistrict.id
			const path = '/'+district+'/current/'+this.props.user.id
			FirebaseManager.post(path, null, () => {

			})
		}

		this.setState({connected: true})

		const path = '/'+district+'/current'
		FirebaseManager.register(path, (err, members) => {
			this.setState({
				currentMembers: (err) ? {} : members
			})

			console.log('CURRENT MEMBERS: '+JSON.stringify(members))
			setTimeout(() => {
				this.connectToFirebase()
			}, 500)
		})
	}

	connectToFirebase(){
		const user = this.props.user
		if (user == null)
			return

		console.log('connectToFirebase: '+JSON.stringify(this.state.currentMembers))
		if (this.state.currentMembers[user.id] != null) // already there
			return
		
		console.log('connectToFirebase: ')
		const district = this.props.session.currentDistrict.id
		const path = '/'+district+'/current/'+user.id
		const member = {
			id: user.id,
			username: user.username,
			image: user.image
		}

		FirebaseManager.post(path, member, () => {

		})
	}

	render(){
		const markers = (this.state.zoom >= 15) ? this.props.session.teams : this.props.session.nearby
		return (
			<Map 
				center={this.props.session.currentLocation} 
				zoom={this.state.zoom} 
				animation={2}
				markers={ markers }
				markerClicked = { this.markerClicked.bind(this) }
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
export default connect(stateToProps, mapDispatchToProps)(MapNavigation)
