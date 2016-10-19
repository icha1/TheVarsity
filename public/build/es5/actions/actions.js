"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

module.exports = {

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
	}


};