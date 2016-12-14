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
			let districtArray = null
			let districtId = null

			if (action.params.districts != null) { // request for profiles by district:
				districtId = action.params.districts
				districtArray = (districtMap[districtId]) ? districtMap[districtId] : []
			}

			action.profiles.forEach(profile => {
				array.push(profile)
				if (map[profile.username] == null){
					map[profile.username] = profile
				}

				if (idMap[profile.id] == null){
					idMap[profile.id] = profile
				}

				if (districtArray != null){
					if (profile.districts.indexOf(districtId) != -1)
						districtArray.push(profile)					
				}
			})

			if (action.params.districts != null)  // request for profiles by district:
				districtMap[districtId] = districtArray
			
			// console.log('PROFILES_RECEIVED: '+JSON.stringify(districtMap))
			newState['map'] = map
			newState['array'] = array
			newState['idMap'] = idMap
			newState['districtMap'] = districtMap
			newState['posts'] = posts
			newState['teams'] = teams
			return newState

		case constants.PROFILE_UPDDATED:
			console.log('PROFILE_UPDDATED: '+JSON.stringify(action.profile))
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
