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
			const keys = Object.keys(action.params)

			action.teams.forEach((team, i) => {
				newState[team.slug] = team
				newState[team.id] = team
			})

			const ignore = ['limit', 'slug', 'featured']
			for (let i=0; i<keys.length; i++){
				let key = keys[i]
				if (ignore.indexOf(key) != -1)
					continue

				let value = action.params[key]
				newState[value] = action.teams
			}

			return newState

		case constants.TEAM_RECEIVED:
//			console.log('TEAM_RECEIVED: '+JSON.stringify(action.team))
			newState[action.team.slug] = action.team
			newState[action.team.id] = action.team
			return newState

		case constants.TEAM_CREATED:
			teamsMap[action.team.slug] = action.team
			array.unshift(action.team)

			newState['map'] = teamsMap
			newState['list'] = array
			return newState

		case constants.TEAM_UPDATED:
			newState[action.team.slug] = action.team
			newState[action.team.id] = action.team
			return newState

		case constants.TEAM_POSTS_RECEIVED:
			let postsArray = (postsMap[action.team.id]==null) ? [] : postsMap[action.team.id]
			action.posts.forEach((post, i) => {
				postsArray.push(post)
			})

			postsMap[action.team.id] = postsArray
			newState['posts'] = postsMap
			return newState

		// case constants.DISTRICT_CHANGED: // when district changes, reset current teams
		// 	newState['list'] = null
		// 	return newState

		default:
			return state
	}
}