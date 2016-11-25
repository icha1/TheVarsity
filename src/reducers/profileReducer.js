import constants from '../constants/constants'
import { profile } from './initial'

var initialState = Object.assign({}, profile.initialState)

const update = (state, profiles) => {
	var newState = Object.assign({}, state)
	var array = Object.assign([], newState.list)
	var map = Object.assign({}, newState.map)
	var posts = Object.assign({}, newState.posts)
	var teams = Object.assign({}, newState.teams)

	profiles.forEach(profile => {
		if (map[profile.username] == null){
			map[profile.username] = profile
			array.push(profile)
		}
	})

	newState['list'] = array
	newState['map'] = map
	newState['posts'] = posts
	newState['teams'] = teams
	return newState
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let array = Object.assign([], newState.list)
	let map = Object.assign({}, newState.map)
	let posts = Object.assign({}, newState.posts)
	let teams = Object.assign({}, newState.teams)

	switch (action.type) {

		case constants.PROFILES_RECEIVED:
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.profiles))
			return update(state, action.profiles)

		case constants.PROFILE_UPDDATED:

			return newState

		case constants.SAVED_POSTS_RECEIVED:
			const id = action.profile.id
			let savedArray = (posts[id] == null) ? [] : posts[id]
			action.posts.forEach((post, i) => {
				savedArray.push(post)
			})

			posts[id] = savedArray
			newState['posts'] = posts
			return newState

		case constants.PROFILE_TEAMS_RECEIVED:
			let teamsArray = (teams[action.profile.id] == null) ? [] : teams[action.profile.id]
			action.teams.forEach((team, i) => {
				teamsArray.push(team)
			})

			teams[action.profile.id] = teamsArray
			newState['teams'] = teams
			return newState

		default:
			return state
	}
}
