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
				type: constants.FETCH_POSTS,
				feed: params.type
			})

			return APIManager.handleGet('/api/post', params)
				.then((response) => {
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
					alert(err.message)
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

	updatePost: (post, params) => {
		return dispatch => {
			APIManager.handlePut('/api/post/'+post.id, params)
			.then((response) => {
				dispatch({
					type: constants.POST_UPDATED,
					post: response.result
				})
			})
			.catch((err) => {
				alert(err.message)
			})
		}
	},

	attendEvent: (post, profile, qty) => {
		return dispatch => {
			APIManager.handleGet('/api/post/'+post.id, null)
			.then((response) => {
				const result = response.result
				let eventDetails = Object.assign({}, result.eventDetails)
				const attendee = {
					id: profile.id,
					username: profile.username,
					image: profile.image,
					qty: qty
				}

				let rsvp = (eventDetails.rsvp) ? Object.assign({}, eventDetails.rsvp) : {}
				rsvp[attendee.id] = attendee
				eventDetails['rsvp'] = rsvp
				eventDetails['count'] = Object.keys(rsvp).length

				result['eventDetails'] = eventDetails
				return APIManager.handlePut('/api/post/'+post.id, result)
			})
			.then((updated) => {
				console.log('UPDATED: '+JSON.stringify(updated))
				dispatch({
					type: constants.POST_UPDATED,
					post: updated.result
				})
			})
			.catch((err) => {
				alert(err.message)
			})
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
			APIManager.handleGet('/api/team', params)
			.then((response) => {
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
				alert(err.message)
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
			APIManager.handleGet('/api/district', params)
			.then((response) => {
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