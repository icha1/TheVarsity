import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { milestoneReducer, postReducer, teamReducer, accountReducer, sessionReducer, profileReducer, applicationReducer } from '../reducers'

var store;

export default {

	configureStore: (initial) => {
		const reducers = combineReducers({
			post: postReducer,
			team: teamReducer,
			session: sessionReducer,
			profile: profileReducer,
			account: accountReducer,
			application: applicationReducer,
			milestone: milestoneReducer
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