import constants from '../constants/constants'

var initialState = {
	currentUser: null,
	teams: []
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.CURRENT_USER_RECIEVED:
//			console.log('CURRENT_USER_RECIEVED: '+JSON.stringify(action.user))
			var newState = Object.assign({}, state)
			newState['currentUser'] = action.user
			return newState

		case constants.TEAMS_RECEIVED:
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.teams))
			var newState = Object.assign({}, state)
			newState['teams'] = action.teams // TODO: check members of each team first
			return newState

		default:
			return state
	}
}