import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by slug
	feed: {}, // organized by type (event, article, etc)
	list: []
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
	return newState
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.POSTS_RECEIVED:
//			console.log('POSTS_RECEIVED')
			return update(state, action.posts)

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

			return newState

		default:
			return state
	}

}
