
export default {
	initialState: {
		map: {}, // organized by slug
		feed: {}, // organized by type (event, article, etc)
		isFetching: false
	},

	populate: (posts) => {
		if (posts == null)
			return null

		var initial = {
			map: {},
			feed: {}, // organized by type (event, article, etc)
			isFetching: false
		}

		posts.forEach(function(post, i){
			initial[post.slug] = post
		})

		return initial
	}
}
