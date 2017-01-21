
export default {
	initialState: {

	},

	populate: (applications) => {
		if (applications == null)
			return null

		var initial = {

		}

		applications.forEach(function(application, i){
			initial[application.slug] = application
			initial[application.id] = application
		})

		return initial
	}
}
