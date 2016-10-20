import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by slug
	list: []
}


const update = (state, venues) => {
	var newState = Object.assign({}, state)
	var array = Object.assign([], newState.list)
	var venuesMap = Object.assign({}, newState.map)

	venues.forEach(venue => {
		if (venuesMap[venue.slug] == null){
			venuesMap[venue.slug] = venue
			array.push(venue)
		}
	})

	newState['list'] = array
	newState['map'] = venuesMap
	return newState
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.VENUES_RECEIVED:
//			console.log('VENUES_RECEIVED')
			return update(state, action.venues)

		default:
			return state
	}

}

	

// }