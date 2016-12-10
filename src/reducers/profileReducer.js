import constants from '../constants/constants'
import { profile } from './initial'

var initialState = Object.assign({}, profile.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let array = Object.assign([], newState.list)
	let map = Object.assign({}, newState.map)
	let idMap = Object.assign({}, newState.idMap)
	let districtMap = Object.assign({}, newState.districtMap)
	let posts = Object.assign({}, newState.posts)
	let teams = Object.assign({}, newState.teams)

	switch (action.type) {

		case constants.PROFILES_RECEIVED:
			action.profiles.forEach(profile => {
				if (map[profile.username] == null){
					map[profile.username] = profile
					array.push(profile)
				}

				if (idMap[profile.id] == null){
					idMap[profile.id] = profile
				}

				// request for profiles by district:
				if (action.params.districts != null){
					const districtId = action.params.districts
					let districtArray = (districtMap[districtId]) ? districtMap[districtId] : []

					if (profile.districts.indexOf(districtId) != -1)
						districtArray.push(profile)
					
					districtMap[districtId] = districtArray

					// profile.districts.forEach((districtId, i) => {
					// 	let districtArray = (districtMap[districtId]) ? districtMap[districtId] : []
					// 	let found = false
					// 	districtArray.forEach((p, i) => {
					// 		if (p.id == profile.id)
					// 			found = true
					// 	})

					// 	if (found == false)
					// 		districtArray.push(profile)

					// 	districtMap[districtId] = districtArray
					// })
				}
			})

//			console.log('PROFILES_RECEIVED: '+JSON.stringify(districtMap))
			newState['list'] = array
			newState['map'] = map
			newState['idMap'] = idMap
			newState['districtMap'] = districtMap
			newState['posts'] = posts
			newState['teams'] = teams
			return newState

		case constants.PROFILE_UPDDATED:
			map[action.profile.username] = action.profile
			newState['map'] = map
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

			saved.push(action.post)
			posts[action.profile.id] = saved
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
