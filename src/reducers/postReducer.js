import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by slug
	list: []
}


const update = (state, posts) => {
	var newState = Object.assign({}, state)
	var array = Object.assign([], newState.list)
	var postsMap = Object.assign({}, newState.map)

	posts.forEach(post => {
		if (postsMap[post.id] == null){
			postsMap[post.id] = post
			array.push(post)
		}
	})

	newState['list'] = array
	newState['map'] = postsMap
	return newState
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.POSTS_RECEIVED:
//			console.log('POSTS_RECEIVED')
			return update(state, action.posts)

		default:
			return state
	}

}

	

// }