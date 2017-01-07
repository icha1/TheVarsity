import constants from '../constants/constants'
import { profile } from './initial'

var initialState = Object.assign({}, profile.initialState)


export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let map = Object.assign({}, newState.map)
	let array = Object.assign([], newState.array)
	let idMap = Object.assign({}, newState.idMap)
	let districtMap = Object.assign({}, newState.districtMap)
	let posts = Object.assign({}, newState.posts)
	let teams = Object.assign({}, newState.teams)

	switch (action.type) {

		case constants.PROFILES_RECEIVED:
//			console.log('PROFILES_RECEIVED: '+JSON.stringify(action.profiles))

			action.profiles.forEach((profile, i) => {
				newState[profile.slug] = profile
			})

			const keys = Object.keys(action.params)
			for (let i=0; i<keys.length; i++){
				let key = keys[i]
				if (key == 'limit')
					continue

				if (key == 'slug') // this was already covered in first loop
					continue

				let value = action.params[key]
				newState[value] = action.profiles
			}

			return newState

		case constants.PROFILE_RECEIVED:
			newState[action.profile.slug] = action.profile
			return newState

		case constants.PROFILE_UPDDATED:
//			console.log('PROFILE_UPDDATED: '+JSON.stringify(action.profile))
			map[action.profile.username] = action.profile
			newState['map'] = map

			// this should be good for most action types:
			let updatedArray = []
			let index = -1
			array.forEach((p, i) => {
				if (p.id == action.profile.id){
					updatedArray.push(action.profile)
					index = i
				}
				else {
					updatedArray.push(p)
				}
			})

			if (index == -1)
				updatedArray.push(action.profile)

			newState['array'] = updatedArray
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

		case constants.POST_SAVED:
			let saved = posts[action.profile.id]
			if (saved == null) // dont' do anything. refresh feed completely on page load
				return newState

			let a = []
			saved.forEach((post, i) => {
				if (post.id == action.post.id){
					if (action.post.saved.indexOf(action.profile.id) != -1)
						a.push(action.post)
				}
				else {
					a.push(post)
				}
			})

			posts[action.profile.id] = a
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
