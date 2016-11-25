import postReducer from './postReducer'
import teamReducer from './teamReducer'
import accountReducer from './accountReducer'
import profileReducer from './profileReducer'
import sessionReducer from './sessionReducer'
import { team, profile, post } from './initial'

export const initial = (reducer, entities) => {
//	console.log('initial = '+reducer)
	switch (reducer){
		case 'team':
			return team.populate(entities)

		case 'profile':
			return profile.populate(entities)

		case 'post':
			return post.populate(entities)

		// case 'session':
		// 	return team.populate()

		// case 'account':
		// 	return team.populate()

		default:
			return {}
	}

}

export {
	postReducer,
	teamReducer,
	sessionReducer,
	accountReducer,
	profileReducer
}