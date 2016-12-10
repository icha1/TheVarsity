
export default {
	initialState: {
		idMap: {}, // organized by id
		districtMap: {},
		map: {}, // organized by username
		array: [],
		posts: {}, // posts keyed by profile ids
		teams: {} // teams keyed by profile ids
	},

	populate: (profiles) => {
		if (profiles == null)
			return null

		var map = {}
		var idMap = {}
		var districtMap = {}
		profiles.forEach(function(profile, i){
			map[profile.slug] = profile
			idMap[profile.id] = profile
		})

		var initial = {
			map: map,
			idMap: idMap,
			districtMap: districtMap,
			array: profiles,
			posts: {}, // posts keyed by profile ids
			teams: {} // teams keyed by profile ids			
		}

		return initial
	}
}