import constants from '../constants/constants'
import { project } from './initial'

var initialState = Object.assign({}, project.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)

	switch (action.type) {
		case constants.PROJECTS_RECEIVED:
			action.projects.forEach((project, i) => {
				newState[projects.slug] = project
				newState[projects.id] = project
			})

			const ignore = ['limit', 'slug', 'status']
			const keys = Object.keys(action.params)
			for (let i=0; i<keys.length; i++){
				let key = keys[i]
				if (ignore.indexOf(key) != -1)
					continue

				let value = action.params[key]
				newState[value] = action.projects
			}

			return newState

		default:
			return state
	}

}
