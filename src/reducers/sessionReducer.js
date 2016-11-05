import constants from '../constants/constants'

var initialState = {
	selectedFeed: 'event',
	reload: false,
	showLoading: false,
	currentLocation: { // default to nyc
		lat: 40.73008847828741,
		lng: -73.99769308314211
	}
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.LOCATION_CHANGED:
			console.log('LOCATION_CHANGED')
			var newState = Object.assign({}, state)
			newState['currentLocation'] = action.location

			return newState

		case constants.SELECTED_FEED_CHANGED:
			console.log('SELECTED_FEED_CHANGED: ' + action.feed)
			var newState = Object.assign({}, state)
			newState['reload'] = (action.feed != newState.selectedFeed)
			newState['selectedFeed'] = action.feed

			return newState

		case constants.POSTS_RECEIVED: // reset realod boolean to false
			var newState = Object.assign({}, state)
			newState['reload'] = false
			return newState

		default:
			return state
	}

}