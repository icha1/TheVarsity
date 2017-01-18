import constants from '../constants/constants'
import { session } from './initial'

var initialState = Object.assign({}, session.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)

	switch (action.type) {
		case constants.LOCATION_CHANGED:
			console.log('LOCATION_CHANGED: '+JSON.stringify(action.location))
			newState['currentLocation'] = action.location

			return newState

		case constants.SELECTED_FEED_CHANGED:
			// newState['reload'] = (action.feed != newState.selectedFeed)
			// newState['selectedFeed'] = action.feed

			newState['selected'] = action.feed
			return newState

		case constants.TOGGLE_SHOW_MAP:
			newState['showMap'] = action.show
			return newState

		default:
			return state
	}

}