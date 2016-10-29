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
	}
	

}