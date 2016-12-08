import constants from '../constants/constants'
import { session } from './initial'

var initialState = Object.assign({}, session.initialState)

const resetSession = (state, districts) => {
	let district = null
	if (districts.length == 0){
		district = {
			id: null,
			name: '',
			recentVisitors: {}
		}
	}
	else {
		district = districts[0]
	}

	district['comments'] = []
	state['currentDistrict'] = district
	state['nearby'] = districts
	state['teams'] = null
	state['reload'] = true // by setting true, this triggers a re-load of the feeds
	return state
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)

	switch (action.type) {

		case constants.LOCATION_CHANGED:
			console.log('LOCATION_CHANGED: '+JSON.stringify(action.location))
			newState['currentLocation'] = action.location

			return newState

		case constants.SELECTED_FEED_CHANGED:
			newState['reload'] = (action.feed != newState.selectedFeed)
			newState['selectedFeed'] = action.feed

			return newState

		case constants.POSTS_RECEIVED: // reset realod boolean to false
			newState['reload'] = false
			return newState

		case constants.TEAMS_RECEIVED:
			newState['teams'] = action.teams
			return newState

		case constants.TEAM_CREATED:
			newState['teams'] = Object.assign([], newState.teams)
			newState.teams.unshift(action.team)
			return newState

		case constants.TEAM_UPDATED:
			let teams = Object.assign([], newState.teams)
			let updatedTeams = []
			teams.forEach((team, i) => {
				if (team.id == action.team.id)
					updatedTeams.push(action.team)				
				else 
					updatedTeams.push(team)
			})

			newState['teams'] = updatedTeams
			return newState

		case constants.TOGGLE_LOADER:
			newState['showLoading'] = action.isLoading
			return newState

		case constants.TOGGLE_SHOW_MAP:
			newState['showMap'] = action.show
			return newState
			
		case constants.DISTRICT_CHANGED:
			// TODO: check if previous district exists, if so then disconnect firebase reference
			return resetSession(newState, action.districts)

		case constants.COMMENTS_RECEIVED:
			var updatedDistrict = Object.assign({}, newState.currentDistrict)
			updatedDistrict['comments'] = action.comments.reverse() // latest comment first
			newState['currentDistrict'] = updatedDistrict

			return newState


		default:
			return state
	}

}