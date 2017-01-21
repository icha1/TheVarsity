import constants from '../constants/constants'
import { application } from './initial'

var initialState = Object.assign({}, application.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)

	switch (action.type){
		case constants.APPLICATIONS_RECEIVED:
//			console.log('APPLICATIONS_RECEIVED: '+JSON.stringify(action.applications))
			action.applications.forEach((application, i) => {
				newState[application.slug] = application
				newState[application.id] = application
			})
			
			return newState

		default:
			return state

	}

}
