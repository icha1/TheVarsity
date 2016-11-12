import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by username
	list: []
}

const update = (state, profiles) => {
	var newState = Object.assign({}, state)
	var array = Object.assign([], newState.list)
	var map = Object.assign({}, newState.map)

	profiles.forEach(profile => {
		if (map[profile.username] == null){
			map[profile.username] = profile
			array.push(profile)
		}
	})

	newState['list'] = array
	newState['map'] = map
	return newState
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.PROFILES_RECEIVED:
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.profiles))
			return update(state, action.profiles)

		default:
			return state
	}
}