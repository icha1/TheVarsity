
export default {
	initialState: {

	},

	populate: (projects) => {
		if (projects == null)
			return null

		let initial = {}

		posts.forEach((project, i) => {
			initial[project.slug] = project
			initial[project.id] = project
		})

		return initial
	}
}
