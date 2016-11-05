"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

module.exports = {

	currentUserReceived: function (user) {
		return {
			type: constants.CURRENT_USER_RECIEVED,
			user: user
		};
	},

	postsReceived: function (posts) {
		return {
			type: constants.POSTS_RECEIVED,
			posts: posts
		};
	},

	venuesReceived: function (venues) {
		return {
			type: constants.VENUES_RECEIVED,
			venues: venues
		};
	},

	teamsReceived: function (teams) {
		return {
			type: constants.TEAMS_RECEIVED,
			teams: teams
		};
	},

	districtChanged: function (districts) {
		// this returns as an arry
		return {
			type: constants.DISTRICT_CHANGED,
			districts: districts
		};
	},

	locationChanged: function (location) {
		return {
			type: constants.LOCATION_CHANGED,
			location: location
		};
	},

	selectedFeedChanged: function (feed) {
		return {
			type: constants.SELECTED_FEED_CHANGED,
			feed: feed
		};
	},

	toggleLoader: function (isLoading) {
		return {
			type: constants.TOGGLE_LOADER,
			isLoading: isLoading
		};
	}


};