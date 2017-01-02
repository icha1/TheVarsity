import constants from '../constants/constants'
import { team } from './initial'

var initialState = Object.assign({}, team.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let array = (newState.list == null) ? [] : Object.assign([], newState.list)
	let teamsMap = Object.assign({}, newState.map)
	let postsMap = Object.assign({}, newState.posts)

	switch (action.type) {
		case constants.TEAMS_RECEIVED:
//			return update(state, action.teams)
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.params))
			const keys = Object.keys(action.params)

			action.teams.forEach((team, i) => {
				newState[team.slug] = team
			})

			keys.forEach((key, i) => {
				if (key != 'limit'){ // ignore this key
					let value = action.params[key]
					newState[value] = action.teams
				}
			})

			return newState

		case constants.TEAM_CREATED:
			teamsMap[action.team.slug] = action.team
			array.unshift(action.team)

			newState['map'] = teamsMap
			newState['list'] = array
			return newState

		case constants.TEAM_UPDATED:
			teamsMap[action.team.slug] = action.team
			// array.unshift(action.team)

			newState['map'] = teamsMap		
			return newState

		case constants.TEAM_POSTS_RECEIVED:
			let postsArray = (postsMap[action.team.id]==null) ? [] : postsMap[action.team.id]
			action.posts.forEach((post, i) => {
				postsArray.push(post)
			})

			postsMap[action.team.id] = postsArray
			newState['posts'] = postsMap
			return newState

		case constants.DISTRICT_CHANGED: // when district changes, reset current teams
			newState['list'] = null
			return newState

		case constants.PROFILE_TEAMS_RECEIVED:
			action.teams.forEach((team, i) => {
				teamsMap[team.slug] = team
			})

			newState['map'] = teamsMap
			return newState

		default:
			return state
	}
}