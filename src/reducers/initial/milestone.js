
export default {
	initialState: {

	},

	populate: (milestones) => {
		if (milestones == null)
			return null

		let initial = {}
		milestones.forEach(function(milestone, i){
			map[milestone.slug] = milestone
			idMap[milestone.id] = milestone
		})

		return initial
	}
}