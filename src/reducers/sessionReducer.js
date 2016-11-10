import constants from '../constants/constants'

var initialState = {
	selectedFeed: constants.FEED_TYPE_EVENT,
	reload: false,
	showLoading: false,
	teams: [],
	currentDistrict: {
		id: null,
		name: 'None',
		comments: []
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
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.teams))
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

			// TODO: check if previous district exists, if so then disconnect firebase reference

			const list = action.districts
			if (list.length == 0){ // reset to null
				newState['currentDistrict'] = {
					id: null,
					name: 'None',
					comments: []
				}

				return newState				
			}

			const district = list[0]
			district['comments'] = []
			newState['currentDistrict'] = district

			firebase.database().ref('/comments/'+district.id).on('value', (snapshot) => {
				const currentComments = snapshot.val()
				// console.log('COMMENTS: '+JSON.stringify(currentComments))
				
				if (currentComments != null){
					action.dispatch({
						type: constants.COMMENTS_RECEIVED,
						comments: currentComments
					})
				}
			})

			return newState

		case constants.COMMENTS_RECEIVED:
			console.log('COMMENTS_RECEIVED: '+JSON.stringify(action.comments))
			var newState = Object.assign({}, state)
			var updatedDistrict = Object.assign({}, newState.currentDistrict)
			updatedDistrict['comments'] = action.comments.reverse() // latest comment first
			newState['currentDistrict'] = updatedDistrict

			return newState

		default:
			return state
	}

}