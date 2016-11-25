
export default {
	initialState: {
		map: {}, // organized by username
		list: [],
		posts: {}, // posts keyed by profile ids
		teams: {} // teams keyed by profile ids
	},

	populate: (profiles) => {
		if (profiles == null)
			return null

		var map = {}
		profiles.forEach(function(profile, i){
			map[profile.slug] = profile
		})

		var initial = {
			map: map,
			list: profiles,
			posts: {}, // posts keyed by profile ids
			teams: {} // teams keyed by profile ids			
		}

		return initial
	}
}