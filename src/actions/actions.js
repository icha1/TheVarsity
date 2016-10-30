import constants from '../constants/constants'

export default {

	currentUserReceived: (user) => {
		return {
			type: constants.CURRENT_USER_RECIEVED,
			user: user
		}
	},

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
	},

	teamsReceived: (teams) => {
		return {
			type: constants.TEAMS_RECEIVED,
			teams: teams
		}
	},

	districtChanged: (districts) => { // this returns as an arry
		return {
			type: constants.DISTRICT_CHANGED,
			districts: districts
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
	}
	

}