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

		}
	}

	componentDidMount(){
		if (this.props.session.currentDistrict.id != null)
			return

		const props = this.props
		const params = {
			limit: 1,
			lat: props.session.currentLocation.lat,
			lng: props.session.currentLocation.lng
		}

//		props.fetchDistrict(params, props.fetchTeams(props.session.currentLocation))
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
			limit: 1,
			lat: location.lat,
			lng: location.lng
		}

//		props.fetchDistrict(params, props.fetchTeams(location))
		props.fetchDistrict(params)
	}

	fetchTeams(){
		if (this.props.session.currentDistrict.id == null)
			return null

		if (this.props.teams == null){
			this.props.fetchTeams(this.props.session.currentLocation)
			return null
		}

		return this.props.teams
	}

	// fetchDistrict(){
	// 	const params = {
	// 		limit: 1,
	// 		lat: this.props.location.lat,
	// 		lng: this.props.location.lng
	// 	}

	// 	const props = this.props
	// 	props.fetchDistrict(params, props.fetchTeams(props.session.currentLocation))

		// APIManager
		// .handleGet('/api/district', params)
		// .then((response) => {
		// 	console.log(JSON.stringify(response))
		// 	const results = response.results
		// 	this.props.districtChanged(results)

		// 	if (results.length == 0)
		// 		return

		// 	return this.fetchTeams(this.props.location)
		// })
		// .catch((err) => {
		// 	alert(err)
		// })


		// APIManager.handleGet('/api/district', params, (err, response) => {
		// 	if (err){
		// 		alert(err)
		// 		return
		// 	}

		// 	const results = response.results
		// 	this.props.districtChanged(results)

		// 	if (results.length == 0)
		// 		return

		// 	const district = results[0]
		// 	FirebaseManager.register('/'+district.id+'/comments', (err, currentComments) => {
		// 		if (err){
		// 			return
		// 		}

		// 		this.props.commentsReceived(currentComments)
		// 		const user = this.props.user
		// 		if (user == null) // not loggged in
		// 			return

		// 		let recentVisitors = district.recentVisitors
		// 		let visit = recentVisitors[user.id]
		// 		if (visit == null) // first visit
		// 			visit = {count: 0}
				
		// 		visit['count'] = visit.count+1
		// 		visit['timestamp'] = Date.now()
		// 		visit['visitor'] = {
		// 			id: user.id,
		// 			username: user.username,
		// 			image: user.image
		// 		}

		// 		recentVisitors[user.id] = visit
		// 		console.log(JSON.stringify(recentVisitors))

		// 		const url = '/api/district/'+district.id
		// 		APIManager.handlePut(url, {recentVisitors: recentVisitors}, (err, result) => {

		// 		})
		// 	})
		// })
//	}

	render(){

		return (
			<Map 
				center={this.props.session.currentLocation} 
				zoom={16} 
				animation={2}
				markers={ this.fetchTeams() }
				mapMoved={this.locationChanged.bind(this)} />
		)
	}

}

const stateToProps = (state) => {
	return {
		session: state.session,
		user: state.account.currentUser,
		teams: state.team.list
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
