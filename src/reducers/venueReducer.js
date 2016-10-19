import constants from '../constants/constants'

var initialState = {
	venues: {}, // organized by slug
	venuesArray: []
}


const update = (state, venues) => {
	var newState = Object.assign({}, state)
	var array = Object.assign([], newState.venuesArray)
	var venuesMap = Object.assign({}, newState.venues)

	for (var i=0; i<venues.length; i++){
		var venue = venues[i]
		if (venuesMap[venue.id] != null) // already there
			continue

		venuesMap[venue.id] = venue
		array.push(venue)
	}

	newState['venuesArray'] = array
	newState['venues'] = venuesMap
	return newState
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.VENUES_RECEIVED:
			console.log('VENUES_RECEIVED')
			return update(state, action.venues)

		default:
			return state
	}

}

	

// }