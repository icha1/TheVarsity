import constants from '../constants/constants'
import { APIManager } from '../utils'

const postData = (path, data, actionType, payloadKey) => {
	return (dispatch) => APIManager
		.handlePost(path, data)
		.then((response) => {
			if (actionType != null){
				dispatch({
					type: actionType,
					[payloadKey]: response.result
				})
			}

			return response
		})
		.catch((err) => {
			throw err
		})
}

const getData = (path, params, actionType, payloadKey) => {
	return (dispatch) => APIManager
		.handleGet(path, params)
		.then((response) => {
			const data = response.results || response.result
			dispatch({
				type: actionType,
				[payloadKey]: data,
				params: params
			})

			return data
		})
		.catch((err) => {
			throw err
		})
}

const putData = (path, data, actionType, payloadKey) => {
	return (dispatch) => APIManager
		.handlePut(path, data)
		.then((response) => {
			const result = response.result
			dispatch({
				type: actionType,
				[payloadKey]: result
			})

			return result
		})
		.catch((err) => {
			throw err
		})
}

export default {
	currentUserReceived: (user) => {
		return {
			type: constants.CURRENT_USER_RECIEVED,
			user: user
		}
	},

	// - - - - - - - - - POSTS - - - - - - - - - 

	createPost: (params) => {
		return dispatch => {
			return dispatch(postData('/api/post', params, constants.POST_CREATED, 'post'))
		}
	},

	fetchPosts: (params) => {
		return dispatch => {
			return dispatch(getData('/api/post', params, constants.POSTS_RECEIVED, 'posts'))
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
//			.handleGet('/api/post', {'author.id':team.id})
			.handleGet('/api/post', {'teams':team.id})
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
			return dispatch(putData('/api/post/'+post.id, params, constants.POST_UPDATED, 'post'))
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
//				console.log('UPDATED: '+JSON.stringify(updated))
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

	unsavePost: (post, profile) => {
		return dispatch => {
			APIManager.handleGet('/api/post/'+post.id, null)
			.then((response) => {
				const result = response.result
				let saved = Object.assign([], result.saved)
				let array = []
				saved.forEach((id, i) => {
					if (id != profile.id)
						array.push(id)
				})

				result['saved'] = array
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
					title: profile.title,
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
			return dispatch(getData('/api/team', params, constants.TEAMS_RECEIVED, 'teams'))
		}
	},

	updateTeam: (team, params) => {
		return dispatch => {
			return dispatch(putData('/api/team/'+team.id, params, constants.TEAM_UPDATED, 'team'))
		}
	},

	createTeam: (team) => {
		return dispatch => {
			return dispatch(postData('/api/team', team, constants.TEAM_CREATED, 'team'))
		}
	},

	sendInvitation: (params) => {
		return dispatch => {
			return dispatch(postData('/api/invitation', params, null, 'invitation'))
		}
	},

	redeemInvitation: (invitation) => {
		return dispatch => {
			return dispatch(postData('/account/redeem', invitation, null, 'invitation'))
		}
	},

	// - - - - - - - - - PROFILES - - - - - - - - - 	

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
			return dispatch(putData('/api/profile/'+profile.id, params, constants.PROFILE_UPDDATED, 'profile'))
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
		return dispatch => {
			return dispatch(getData('/api/district', params, constants.DISTRICT_CHANGED, 'districts'))
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
	},

	toggleShowMap: (show) => {
		return {
			type: constants.TOGGLE_SHOW_MAP,
			show: show
		}
	}
	
}