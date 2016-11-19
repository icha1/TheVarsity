import constants from '../constants/constants'
import { APIManager } from '../utils'

export default {

	currentUserReceived: (user) => {
		return {
			type: constants.CURRENT_USER_RECIEVED,
			user: user
		}
	},

	fetchPosts: (params) => {
//		console.log('ACTIONS - FETCH_POSTS: '+JSON.stringify(params))

		return dispatch => {
			dispatch({
				type: constants.FETCH_POSTS
			})

			return APIManager
				.handleGet('/api/post', params)
				.then((response) => {
//					console.log('POSTS: '+JSON.stringify(response))
					const results = response.results
					dispatch({
						type: constants.POSTS_RECEIVED,
						posts: response.results
					})

					return results
				})
				.then((results) => {

				})
				.catch((err) => {
					alert(err)
				})
		}
	},

	postsReceived: (posts) => {
		return {
			type: constants.POSTS_RECEIVED,
			posts: posts
		}
	},

	postCreated: (post) => {
		return {
			type: constants.POST_CREATED,
			post: post
		}
	},

	venuesReceived: (venues) => {
		return {
			type: constants.VENUES_RECEIVED,
			venues: venues
		}
	},

	fetchTeams: (params) => {
//		console.log('ACTIONS - fetchTeams: '+JSON.stringify(params))
		return dispatch => {
			APIManager
			.handleGet('/api/team', params)
			.then((response) => {
//				console.log(JSON.stringify(response))
				const results = response.results
				dispatch({
					type: constants.TEAMS_RECEIVED,
					teams: results
				})

				return results
			})
			.then((results) => {

			})
			.catch((err) => {
				alert(err)
			})
		}
	},

	teamsReceived: (teams) => {
		return {
			type: constants.TEAMS_RECEIVED,
			teams: teams
		}
	},

	teamCreated: (team) => {
		return {
			type: constants.TEAM_CREATED,
			team: team
		}
	},

	profilesReceived: (profiles) => {
		return {
			type: constants.PROFILES_RECEIVED,
			profiles: profiles
		}
	},

	fetchDistrict: (params, next) => {
//		console.log('ACTIONS - fetchDistrict: '+JSON.stringify(params))
		return (dispatch) => {
			APIManager
			.handleGet('/api/district', params)
			.then((response) => {
//				console.log(JSON.stringify(response))
				const results = response.results
				dispatch({
					type: constants.DISTRICT_CHANGED,
					districts: results					
				})

				return results
			})
			.then((results) => {
				if (next != null)
					return next()
			})
			.catch((err) => {
				alert(err)
			})
		}
	},

	districtChanged: (districts) => { // this returns as an array
		return {
			type: constants.DISTRICT_CHANGED,
			districts: districts
		}
	},

	commentsReceived: (comments) => {
		return {
			type: constants.COMMENTS_RECEIVED,
			comments: comments
		}
	},

	locationChanged: (location) => {
		return {
			type: constants.LOCATION_CHANGED,
			location: location
		}		
	},

	selectedFeedChanged: (feed) => {
		return {
			type: constants.SELECTED_FEED_CHANGED,
			feed: feed
		}		
	},

	toggleLoader: (isLoading) => {
		return {
			type: constants.TOGGLE_LOADER,
			isLoading: isLoading
		}		

	}
	

}