import constants from '../constants/constants'

export default {

	postsReceived: (posts) => {
		return {
			type: constants.POSTS_RECEIVED,
			posts: posts
		}
	},

	venuesReceived: (venues) => {
		return {
			type: constants.VENUES_RECEIVED,
			venues: venues
		}
	}
	

}