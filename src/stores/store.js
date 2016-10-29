import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { postReducer, locationReducer, districtReducer, teamReducer } from '../reducers'

var store;

export default {

	configureStore: (initial) => {
		const reducers = combineReducers({
			post: postReducer,
			team: teamReducer,
			location: locationReducer,
			district: districtReducer
		})

		store = createStore(
			reducers,
			initial,
			applyMiddleware(thunk)
		)

		return store
	},


	currentStore: () => {
		return store
	}
}