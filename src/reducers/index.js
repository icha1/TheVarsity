import postReducer from './postReducer'
import teamReducer from './teamReducer'
import accountReducer from './accountReducer'
import profileReducer from './profileReducer'
import sessionReducer from './sessionReducer'
import applicationReducer from './applicationReducer'
import milestoneReducer from './milestoneReducer'
import projectReducer from './projectReducer'
import { team, profile, post, session, application, project } from './initial'

export const initial = (reducer, entities) => {
//	console.log('initial = '+reducer)
	switch (reducer){
		case 'team':
			return team.populate(entities)

		case 'profile':
			return profile.populate(entities)

		case 'post':
			return post.populate(entities)

		case 'project':
			return project.populate(entities)

		case 'session':
			return session.populate(entities)

		case 'application':
			return application.populate(entities)

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
	profileReducer,
	applicationReducer,
	milestoneReducer,
	projectReducer
}