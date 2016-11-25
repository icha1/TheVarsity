
export default {
	initialState: {
		map: {}, // organized by slug
		feed: {}, // organized by type (event, article, etc)
		isFetching: false
	},

	populate: (posts) => {
		if (posts == null)
			return null

		var map = {}
		posts.forEach(function(post, i){
			map[post.slug] = post
		})

		var initial = {
			map: map,
			feed: {}, // organized by type (event, article, etc)
			isFetching: false
		}

		return initial
	}
}