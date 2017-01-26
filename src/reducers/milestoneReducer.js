import constants from '../constants/constants'
import { milestone } from './initial'

var initialState = Object.assign({}, milestone.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)

	switch (action.type) {
		// case constants.TOGGLE_SHOW_MAP:
		// 	newState['showMap'] = action.show
		// 	return newState

		case constants.MILESTONES_RECEIVED:
			return newState

		default:
			return state
	}

}