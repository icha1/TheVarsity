import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by slug
	feed: {}, // organized by type (event, article, etc)
	list: [],
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

	newState['list'] = array
	newState['map'] = postsMap
	newState['feed'] = postsFeed
	newState['isFetching'] = false
	return newState
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.FETCH_POSTS:
			var newState = Object.assign({}, state)
			newState['isFetching'] = true
			return newState


		case constants.POSTS_RECEIVED:
			// console.log('POSTS_RECEIVED')
			return update(state, action.posts)

		case constants.POST_UPDATED:
			var newState = Object.assign({}, state)
			var array = Object.assign([], newState.list)
			var postsMap = Object.assign({}, newState.map)
			var postsFeed = Object.assign({}, newState.feed)

			postsMap[action.post.slug] = action.post
			newState['map'] = postsMap

			return newState

		case constants.POST_CREATED:
			var newState = Object.assign({}, state)
			var array = Object.assign([], newState.list)
			var postsMap = Object.assign({}, newState.map)
			var postsFeed = Object.assign({}, newState.feed)

			const post = action.post
			if (postsMap[post.slug] == null){
				postsMap[post.slug] = post
				array.unshift(post)

				let feedArray = (postsFeed[post.type]==null) ? [] : postsFeed[post.type]
				feedArray.unshift(post) // when creating new post, add straight to top
				postsFeed[post.type] = feedArray				
			}

			newState['list'] = array
			newState['map'] = postsMap
			newState['feed'] = postsFeed
			newState['isFetching'] = false

			return newState

		case constants.DISTRICT_CHANGED:
			// when district changes, reset current posts
			var newState = Object.assign({}, state)
			newState['map'] = {}
			newState['feed'] = {}
			newState['list'] = []

			return newState

		default:
			return state
	}

}
