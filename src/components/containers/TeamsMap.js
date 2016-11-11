import React, { Component } from 'react'
import { APIManager, FirebaseManager } from '../../utils'
import actions from '../../actions/actions'
import { connect } from 'react-redux'
import { Map } from '../view'

class TeamsMap extends Component {
	constructor(){
		super()
		this.fetchTeams = this.fetchTeams.bind(this)
		this.fetchDistrict = this.fetchDistrict.bind(this)
		this.calculateDistance = this.calculateDistance.bind(this)
		this.state = {

		}
	}

	componentDidMount(){
		if (this.props.teams.length == 0)
			this.fetchTeams(this.props.location)
	}

	calculateDistance(location){
		const currentLocation = this.props.location
		const deltaX = currentLocation.lat-location.lat
		const deltaY = currentLocation.lng-location.lng
		var cSquared = (deltaY*deltaY) + (deltaX*deltaX)
		var dist = Math.sqrt(cSquared)
		return dist
	}

	locationChanged(location){
		console.log('locationChanged: '+JSON.stringify(location))
		console.log('currentLocation: '+JSON.stringify(this.props.location))
		const distance = this.calculateDistance(location)
		console.log('Distance: '+JSON.stringify(distance))

		if (distance < 0.01)
			return		

		this.props.locationChanged(location)
		this.fetchTeams(location)
	}

	fetchTeams(location){
		APIManager.handleGet('/api/team', location, (err, response) => {
			if (err){
				alert(err)
				return
			}

			this.props.teamsReceived(response.results)
			this.fetchDistrict()
		})
	}

	fetchDistrict(){
		const params = {
			limit: 1,
			lat: this.props.location.lat,
			lng: this.props.location.lng
		}

		console.log('fetchDistrict: '+JSON.stringify(params))
		APIManager.handleGet('/api/district', params, (err, response) => {
			if (err){
				alert(err)
				return
			}

			const results = response.results
			this.props.districtChanged(results)

			if (results.length == 0)
				return

			const district = results[0]
			FirebaseManager.database().ref('/comments/'+district.id).on('value', (snapshot) => {
				const currentComments = snapshot.val()
				if (currentComments == null)
					return

				this.props.commentsReceived(currentComments)
			})
		})
	}

	render(){
		return (
			<Map 
				center={this.props.location} 
				zoom={16} 
				animation={2}
				markers={this.props.teams}
				mapMoved={this.locationChanged.bind(this)} />
		)
	}

}

const stateToProps = (state) => {
	return {
		location: state.session.currentLocation,
		teams: state.team.list
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		teamsReceived: teams => dispatch(actions.teamsReceived(teams)),
		districtChanged: districts => dispatch(actions.districtChanged(districts)),
		commentsReceived: comments => dispatch(actions.commentsReceived(comments)),
		locationChanged: location => dispatch(actions.locationChanged(location))
	}
}
export default connect(stateToProps, mapDispatchToProps)(TeamsMap)
