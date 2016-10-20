import constants from '../constants/constants'

var initialState = {
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

		default:
			return state
	}

}