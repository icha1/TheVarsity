import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { postReducer } from '../reducers'

var store;

export default {

	configureStore: (initial) => {
		const reducers = combineReducers({
			postReducer: postReducer
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