import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { milestoneReducer, postReducer, projectReducer, teamReducer, accountReducer, sessionReducer, profileReducer, applicationReducer } from '../reducers'

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
			milestone: milestoneReducer,
			project: projectReducer
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