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
			const keys = Object.keys(action.params)

			action.milestones.forEach((milestone, i) => {
				newState[milestone.slug] = milestone
				newState[milestone.id] = milestone
			})

			const ignore = ['limit', 'slug', 'status']
			for (let i=0; i<keys.length; i++){
				let key = keys[i]
				if (ignore.indexOf(key) != -1)
					continue

				let value = action.params[key]
				newState[value] = action.milestones
			}

			return newState

		default:
			return state
	}

}