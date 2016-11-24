import constants from '../constants/constants'

var initialState = {
	selectedFeed: constants.FEED_TYPE_NEWS,
	reload: false,
	showLoading: false,
	teams: [],
	nearby: [], // districts nearby
	currentDistrict: {
		id: null,
		name: '',
		comments: [],
		recentVisitors: {}
	},
	currentLocation: { // default to nyc
		lat: 40.73008847828741,
		lng: -73.99769308314211
	}
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
			
		case constants.DISTRICT_CHANGED:
			// TODO: check if previous district exists, if so then disconnect firebase reference

			const list = action.districts
			if (list.length == 0){ // reset to null
				newState['currentDistrict'] = {
					id: null,
					name: '',
					comments: [],
					recentVisitors: {}
				}

				return newState
			}

			const district = list[0]
			district['comments'] = []
			newState['nearby'] = []
			newState['currentDistrict'] = district
			newState['reload'] = true // by setting true, this triggers a re-load of the feeds
			return newState

		case constants.COMMENTS_RECEIVED:
			var updatedDistrict = Object.assign({}, newState.currentDistrict)
			updatedDistrict['comments'] = action.comments.reverse() // latest comment first
			newState['currentDistrict'] = updatedDistrict

			return newState

		default:
			return state
	}

}