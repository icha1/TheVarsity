import constants from '../constants/constants'
import { milestone } from './initial'

var initialState = Object.assign({}, milestone.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)

	switch (action.type) {
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

		case constants.MILESTONE_CREATED:
			newState[action.milestone.slug] = action.milestone
			newState[action.milestone.id] = action.milestone

			let array = (newState[action.milestone.project.id]) ? Object.assign([], newState[action.milestone.project.id]) : []
			array.unshift(action.milestone)
			newState[action.milestone.project.id] = array

			return newState

		default:
			return state
	}

}