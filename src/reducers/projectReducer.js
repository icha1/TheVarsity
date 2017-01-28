import constants from '../constants/constants'
import { project } from './initial'

var initialState = Object.assign({}, project.initialState)

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	const ignore = ['limit', 'slug', 'status']

	switch (action.type) {
		case constants.PROJECTS_RECEIVED:
			action.projects.forEach((project, i) => {
				newState[project.slug] = project
				newState[project.id] = project
			})

			Object.keys(action.params).forEach((key, i) => {
				if (ignore.indexOf(key) == -1){
					let value = action.params[key]
					newState[value] = action.projects
				}
			})

			return newState

		// since projects are actually posts, register for this callback too:
		case constants.POST_CREATED:
			newState[action.post.slug] = action.post
			newState[action.post.id] = action.post
			return newState

		// since projects are actually posts, register for this callback too:
		case constants.POSTS_RECEIVED:
			let filtered = action.posts.filter((post, i) => {
				return (post.type == 'project')
			})

			filtered.forEach((project, i) => {
				newState[project.slug] = project
				newState[project.id] = project
			})

			Object.keys(action.params).forEach((key, i) => {
				if (ignore.indexOf(key) == -1){
					let value = action.params[key]
					newState[value] = filtered
				}
			})
			return newState

		case constants.POST_UPDATED:
			newState[action.post.slug] = action.post

			if (newState[action.post.author.id]){
				let list = Object.assign([], newState[action.post.author.id])
				let updatedList = []
				list.forEach((post, i) => {
					const entry = (post.id == action.post.id) ? action.post : post
					updatedList.push(entry)
				})

				newState[action.post.author.id] = updatedList
			}

			action.post.teams.forEach((teamId, i) => {
				if (newState[teamId]){
					let list = Object.assign([], newState[teamId])
					let updatedList = []
					list.forEach((post, i) => {
						const entry = (post.id == action.post.id) ? action.post : post
						updatedList.push(entry)
					})

					newState[teamId] = updatedList
				}
			})

			return newState			

		default:
			return state
	}

}
