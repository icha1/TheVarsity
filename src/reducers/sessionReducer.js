import constants from '../constants/constants'

var initialState = {
	selectedFeed: 'event',
	reload: false,
	showLoading: false,
	teams: [],
	currentDistrict: {
		id: null,
		name: 'None'
	},
	currentLocation: { // default to nyc
		lat: 40.73008847828741,
		lng: -73.99769308314211
	}
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.LOCATION_CHANGED:
			console.log('LOCATION_CHANGED: '+JSON.stringify(action.location))
			var newState = Object.assign({}, state)
			newState['currentLocation'] = action.location

			return newState

		case constants.SELECTED_FEED_CHANGED:
//			console.log('SELECTED_FEED_CHANGED: ' + action.feed)
			var newState = Object.assign({}, state)
			newState['reload'] = (action.feed != newState.selectedFeed)
			newState['selectedFeed'] = action.feed

			return newState

		case constants.POSTS_RECEIVED: // reset realod boolean to false
			var newState = Object.assign({}, state)
			newState['reload'] = false
			return newState

		case constants.TEAMS_RECEIVED:
			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.teams))
			var newState = Object.assign({}, state)
			newState['teams'] = action.teams
			return newState

		case constants.TOGGLE_LOADER:
//			console.log('TOGGLE_LOADER')
			var newState = Object.assign({}, state)
			newState['showLoading'] = action.isLoading
			return newState
			
		case constants.DISTRICT_CHANGED:
			console.log('DISTRICT_CHANGED'+JSON.stringify(action.districts))
			var newState = Object.assign({}, state)
			const list = action.districts
			if (list.length == 0){ // reset to null
				newState['currentDistrict'] = {
					id: null,
					name: 'None'
				}

				return newState				
			}

			const district = list[0]
			newState['currentDistrict'] = district
			return newState


		default:
			return state
	}

}