
export default {
	initialState: {

	},

	populate: (applications) => {
		if (applications == null)
			return null

		var initial = {

		}

		applications.forEach(function(application, i){
			initial[post.id] = applications
		})

		return initial
	}
}
