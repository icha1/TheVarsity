import constants from '../constants/constants'
import { APIManager } from '../utils'

export default {
	currentUserReceived: (user) => {
		return {
			type: constants.CURRENT_USER_RECIEVED,
			user: user
		}
	},

	// - - - - - - - - - POSTS - - - - - - - - - 

	fetchPosts: (params) => {
		return dispatch => {
			dispatch({
				type: constants.FETCH_POSTS,
				feed: params.type
			})

			APIManager.handleGet('/api/post', params)
			.then((response) => {
				const results = response.results
				dispatch({
					type: constants.POSTS_RECEIVED,
					posts: response.results
				})

				return results
			})
			.catch((err) => {
				alert(err.message)
			})
		}
	},

	fetchSavedPosts: (profile) => {
		return (dispatch) => {
			APIManager
			.handleGet('/api/post', {saved:profile.id})
			.then((response) => {
				dispatch({
					type: constants.SAVED_POSTS_RECEIVED,
					profile: profile,
					posts: response.results
				})

				return response.results
			})
			.catch((err) => {
				alert(err.message)
			})
		}
	},

	fetchTeamPosts: (team) => {
		return (dispatch) => {
			APIManager
			.handleGet('/api/post', {'author.id':team.id})
			.then((response) => {
//				console.log('FETCH TEAM POSTS: '+team.id+' == '+JSON.stringify(response))
				let results = response.results
				dispatch({
					type: constants.TEAM_POSTS_RECEIVED,
					team: team,
					posts: results
				})

				return results
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

	savePost: (post, profile) => {
		return dispatch => {
			APIManager.handleGet('/api/post/'+post.id, null)
			.then((response) => {
				const result = response.result
				let saved = Object.assign([], result.saved)
				saved.push(profile.id)
				result['saved'] = saved
				return APIManager.handlePut('/api/post/'+post.id, result)
			})
			.then((updated) => {
				console.log('UPDATED: '+JSON.stringify(updated))
				dispatch({
					type: constants.POST_SAVED,
					profile: profile,
					post: updated.result
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

	// - - - - - - - - - TEAMS - - - - - - - - - 

	fetchTeams: (params) => {
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

	fetchProfileTeams: (profile) => {
		return (dispatch) => {

			APIManager
			.handleGet('/api/team', {'members.id':profile.id})
			.then((response) => {
				let results = response.results
				dispatch({
					type: constants.PROFILE_TEAMS_RECEIVED,
					teams: results,
					profile: profile
				})

				return results
			})
			.catch((err) => {
				alert(JSON.stringify(err))
			})
		}
	},

	updateTeam: (team, params) => {
		return dispatch => {
			APIManager.handlePut('/api/team/'+team.id, params)
			.then((response) => {
				let result = response.result
				dispatch({
					type: constants.TEAM_UPDATED,
					team: result
				})

				return result
			})
			.catch((err) => {
				alert(err.message)
			})
		}
	},

	createTeam: (team, next) => {
		return dispatch => {
			APIManager.handlePost('/api/team', team)
			.then((response) => {
				const result = response.result
				dispatch({
					type: constants.TEAM_CREATED,
					team: result					
				})

				return result
			})
			.then((result) => {
				next(result)
				return
			})
			.catch((err) => {
				alert(err)
			})
		}
	},

	// - - - - - - - - - PROFILES - - - - - - - - - 	

	// fetchProfile: (username) => {
	// 	return (dispatch) => {
	// 		APIManager
	// 		.handleGet('/api/profile', {username:username})
	// 		.then((response) => {
	// 			dispatch({
	// 				type: constants.PROFILES_RECEIVED,
	// 				profiles: response.results
	// 			})

	// 			return response.results
	// 		})
	// 		.catch((err) => {
	// 			alert(JSON.stringify(err))
	// 		})
	// 	}
	// },

	fetchProfiles: (params) => {
		return (dispatch) => {
			APIManager
			.handleGet('/api/profile', params)
			.then((response) => {
				dispatch({
					type: constants.PROFILES_RECEIVED,
					profiles: response.results,
					params: params
				})

				return response.results
			})
			.catch((err) => {
				alert('ERROR: '+err)
			})
		}
	},

	updateProfile: (profile, params) => {
		return dispatch => {
			APIManager
			.handlePut('/api/profile/'+profile.id, params)
			.then((response) => {
				dispatch({
					type: constants.PROFILE_UPDDATED,
					profile: response.result
				})

				return response.result
			})
			.catch((err) => {
				alert(JSON.stringify(err))
			})
		}
	},

	profilesReceived: (profiles) => {
		return {
			type: constants.PROFILES_RECEIVED,
			profiles: profiles
		}
	},

	// - - - - - - - - - PROFILES - - - - - - - - - 	

	fetchDistrict: (params) => {
		return (dispatch) => {
			APIManager
			.handleGet('/api/district', params)
			.then((response) => {
				const results = response.results
//				console.log(JSON.stringify(response))
				dispatch({
					type: constants.DISTRICT_CHANGED,
					districts: results					
				})

				return response
			})
			.catch((err) => {
				alert('ERROR: '+err)
			})
		}
	},

	districtChanged: (districts) => { // this returns as an array
		return {
			type: constants.DISTRICT_CHANGED,
			districts: districts
		}
	},

	updateDistrict: (district, params) => {
		return dispatch => {
			APIManager
			.handlePut('/api/district/'+district.id, params)
			.then((response) => {
				// dispatch({
				// 	type: constants.PROFILE_UPDDATED,
				// 	profile: response.result
				// })

				return response.result
			})
			.catch((err) => {
				alert(JSON.stringify(err))
			})
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
	},

	toggleShowMap: (show) => {
		return {
			type: constants.TOGGLE_SHOW_MAP,
			show: show
		}
	}
	
}