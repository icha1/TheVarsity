import constants from '../constants/constants'
import { post } from './initial'

var initialState = Object.assign({}, post.initialState)

const postUpdated = (action, state, post) => {
	let newState = Object.assign({}, state)
	let postsMap = Object.assign({}, newState.map)
	let postsFeed = Object.assign({}, newState.feed)

	postsMap[action.post.slug] = action.post
	newState['map'] = postsMap

	// updated feed object:
	const type = action.post.type // event, news
	let all = (postsFeed['all'] == null) ? [] : postsFeed['all']
	let array = []
	all.forEach((post, i) => {
		if (post.id == action.post.id)
			array.push(action.post) // insert updated post
		else 
			array.push(post)
	})	
	postsFeed['all'] = array


	let feedArray = (postsFeed[type]==null) ? [] : postsFeed[type]
	let updatedFeedArray = []
	feedArray.forEach((post, i) => {
		if (post.id == action.post.id)
			updatedFeedArray.push(action.post) // insert updated post
		else 
			updatedFeedArray.push(post)
	})

	postsFeed[type] = updatedFeedArray
	newState['feed'] = postsFeed

	return newState
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let postsMap = Object.assign({}, newState.map)
	let postsFeed = Object.assign({}, newState.feed)

	switch (action.type) {
		case constants.FETCH_POSTS:
			newState['isFetching'] = true

			// prepare an empty array for the feed being fetched
			// so that it initializes and doesn't trigger 
			// rerender infinitely on Feed component
			postsFeed[action.feed] = []
			newState['feed'] = postsFeed
			return newState

		case constants.POSTS_RECEIVED:
			const keys = Object.keys(action.params)
			action.posts.forEach((post, i) => {
				newState[post.slug] = post
			})

			for (let i=0; i<keys.length; i++){
				let key = keys[i]
				if (key == 'limit')
					continue

				if (key == 'slug') // this was already covered in first loop
					continue

				let value = action.params[key]
				newState[value] = action.posts
			}

			return newState

		case constants.SAVED_POSTS_RECEIVED:
			action.posts.forEach((post, i) => {
				postsMap[post.slug] = post
			})

			newState['map'] = postsMap
			return newState
			
		case constants.TEAM_POSTS_RECEIVED:
			action.posts.forEach((post, i) => {
				postsMap[post.slug] = post
			})

			newState['map'] = postsMap
			return newState

		case constants.POST_SAVED: // basically the same a POST_UPDATED
			newState[action.post.slug] = action.post
			return newState

//			return postUpdated(action, state, post)

		case constants.POST_UPDATED:
			return postUpdated(action, state, post)

		case constants.POST_CREATED:
			const post = action.post
			newState[post.slug] = post

			post.teams.forEach((teamId, i) => {
				let teamArray = newState[teamId]
				if (teamArray != null){
					teamArray.unshift(post)
					newState[teamId] = teamArray
				}
			})

			return newState		

		case constants.DISTRICT_CHANGED: // when district changes, reset current posts
			newState['map'] = {}
			newState['feed'] = {}

			return newState

		default:
			return state
	}

}
