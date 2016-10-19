import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { postReducer, locationReducer, venueReducer } from '../reducers'

var store;

export default {

	configureStore: (initial) => {
		const reducers = combineReducers({
			postReducer: postReducer,
			venueReducer: venueReducer,
			locationReducer: locationReducer
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