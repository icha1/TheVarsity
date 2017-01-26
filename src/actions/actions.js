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
			if (actionType != null){
				dispatch({
					type: actionType,
					[payloadKey]: data,
					params: params
				})
			}

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
		params['status'] = 'live' // only fetch live posts
		return dispatch => {
			return dispatch(getData('/api/post', params, constants.POSTS_RECEIVED, 'posts'))
		}
	},

	fetchPostById: (id) => {
		return dispatch => {
			return dispatch(getData('/api/post/'+id, null, null, 'post'))
		}
	},

	postsReceived: (posts) => {
		return {
			type: constants.POSTS_RECEIVED,
			posts: posts
		}
	},

	updatePost: (post, params) => {
		return dispatch => {
			return dispatch(putData('/api/post/'+post.id, params, constants.POST_UPDATED, 'post'))
		}
	},

	fetchMilestones: (params) => {
		return dispatch => {
			return dispatch(getData('/api/milestone', params, constants.MILESTONES_RECEIVED, 'milestone'))
		}
	},

	applyToJob: (application) => {
		return dispatch => {
			return dispatch(postData('/account/application', application, null, 'application'))
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

	// - - - - - - - - - TEAMS - - - - - - - - - 

	fetchTeams: (params) => {
		return dispatch => {
			return dispatch(getData('/api/team', params, constants.TEAMS_RECEIVED, 'teams'))
		}
	},

	fetchTeam: (id) => {
		return dispatch => {
			return dispatch(getData('/api/team/'+id, null, constants.TEAM_RECEIVED, 'team'))
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
			return dispatch(postData('/account/invite', params, null, 'invitation'))
		}
	},

	requestInvitation: (params) => {
		return dispatch => {
			return dispatch(postData('/account/requestinvite', params, null, 'invitation'))
		}
	},

	redeemInvitation: (invitation) => {
		return dispatch => {
			return dispatch(postData('/account/redeem', invitation, null, 'invitation'))
		}
	},

	setCurrentTeam: (team) => {
		return {
			type: constants.SET_CURRENT_TEAM,
			team: team
		}
	},


	// - - - - - - - - - PROFILES - - - - - - - - - 	

	fetchProfiles: (params) => {
		return dispatch => {
			return dispatch(getData('/api/profile', params, constants.PROFILES_RECEIVED, 'profiles'))
		}
	},

	fetchProfile: (id) => {
		return dispatch => {
			return dispatch(getData('/api/profile/'+id, null, constants.PROFILE_RECEIVED, 'profile'))
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

	fetchApplications: (params) => {
		return dispatch => {
			return dispatch(getData('/api/application', params, constants.APPLICATIONS_RECEIVED, 'applications'))
		}
	},

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

	createComment: (comment) => {
		return dispatch => {
			return dispatch(postData('/api/comment', comment, constants.COMMENT_CREATED, 'comment'))
		}
	},

	fetchComments: (params) => {
		return dispatch => {
			return dispatch(getData('/api/comment', params, constants.COMMENTS_RECEIVED, 'comments'))
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

	selectedFeedChanged: (feed) => { // contains page and selected
		return {
			type: constants.SELECTED_FEED_CHANGED,
			page: feed.page,
			selected: feed.selected
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