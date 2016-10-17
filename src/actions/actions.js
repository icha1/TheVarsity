import constants from '../constants/constants'

export default {

	postsReceived: (posts) => {
		return {
			type: constants.POSTS_RECEIVED,
			posts: posts
		}
	}

	

}