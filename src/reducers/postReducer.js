import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by slug
	feed: {}, // organized by type (event, article, etc)
	isFetching: false
}


const update = (state, posts) => {
	var newState = Object.assign({}, state)
	var array = Object.assign([], newState.list)
	var postsMap = Object.assign({}, newState.map)
	var postsFeed = Object.assign({}, newState.feed)

	posts.forEach(post => {
		if (postsMap[post.slug] == null){
			postsMap[post.slug] = post
			array.push(post)

			let feedArray = (postsFeed[post.type]==null) ? [] : postsFeed[post.type]
			feedArray.push(post)
			postsFeed[post.type] = feedArray
		}
	})

	newState['map'] = postsMap
	newState['feed'] = postsFeed
	newState['isFetching'] = false
	return newState
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let array = Object.assign([], newState.list)
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
			// console.log('POSTS_RECEIVED')
			return update(state, action.posts)

		case constants.POST_UPDATED:
			postsMap[action.post.slug] = action.post
			newState['map'] = postsMap

			// updated feed object:
			const type = action.post.type // event, news
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

		case constants.POST_CREATED:
			const post = action.post
			if (postsMap[post.slug] == null){
				postsMap[post.slug] = post
				array.unshift(post)

				let feedArray = (postsFeed[post.type]==null) ? [] : postsFeed[post.type]
				feedArray.unshift(post) // when creating new post, add straight to top
				postsFeed[post.type] = feedArray				
			}

			newState['map'] = postsMap
			newState['feed'] = postsFeed
			newState['isFetching'] = false

			return newState

		case constants.DISTRICT_CHANGED: // when district changes, reset current posts
			newState['map'] = {}
			newState['feed'] = {}

			return newState

		default:
			return state
	}

}
