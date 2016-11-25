import constants from '../constants/constants'
import { team } from './initial'

var initialState = Object.assign({}, team.initialState)

const update = (state, teams) => {
	var newState = Object.assign({}, state)
	var array = (newState.list == null) ? [] : Object.assign([], newState.list)
	var teamsMap = Object.assign({}, newState.map)

	teams.forEach(team => {
		if (teamsMap[team.slug] == null){
			teamsMap[team.slug] = team
			array.push(team)
		}
	})

	newState['list'] = array
	newState['map'] = teamsMap
	return newState
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let array = (newState.list == null) ? [] : Object.assign([], newState.list)
	let teamsMap = Object.assign({}, newState.map)
	let postsMap = Object.assign({}, newState.posts)

	switch (action.type) {
		case constants.TEAMS_RECEIVED:
			return update(state, action.teams)

		case constants.TEAM_CREATED:
			teamsMap[action.team.slug] = action.team
			newState['map'] = teamsMap
			return newState

		case constants.TEAM_UPDATED:
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