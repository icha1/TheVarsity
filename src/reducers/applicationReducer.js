import constants from '../constants/constants'
import { application } from './initial'

var initialState = Object.assign({}, application.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)

	switch (action.type){


		default:
			return state

	}

}
