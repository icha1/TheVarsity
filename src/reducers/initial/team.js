
export default {
	initialState: {
		map: {}, // organized by slug
		list: null,
		posts: {} // keyed by team id
	},

	populate: (teams) => {
		if (teams == null)
			return null

		var map = {}
		teams.forEach(function(team, i){
			map[team.slug] = team
		})

		var initial = {
			list: teams,
			posts: {},
			map: map
		}

		return initial
	}
}