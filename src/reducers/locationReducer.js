import constants from '../constants/constants'

var initialState = {
	currentLocation: { // default to nyc
		lat: 40.731226699890954,
		lng: -73.99580480799563

	}
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.LOCATION_CHANGED:
			console.log('LOCATION_CHANGED')
			var newState = Object.assign({}, state)
			newState['currentLocation'] = action.location

			return newState

		default:
			return state
	}

}