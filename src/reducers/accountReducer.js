import constants from '../constants/constants'

var initialState = {
	currentUser: {
		id: null
	}
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.CURRENT_USER_RECIEVED:
			console.log('CURRENT_USER_RECIEVED'+JSON.stringify(action.user))
			var newState = Object.assign({}, state)
			newState['currentUser'] = action.user
			return newState

		default:
			return state
	}
}