"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	map: {}, // organized by slug
	feed: {}, // organized by type (event, article, etc)
	list: []
};


var update = function (state, posts) {
	var newState = Object.assign({}, state);
	var array = Object.assign([], newState.list);
	var postsMap = Object.assign({}, newState.map);
	var postsFeed = Object.assign({}, newState.feed);

	posts.forEach(function (post) {
		if (postsMap[post.id] == null) {
			postsMap[post.id] = post;
			array.push(post);

			var feedArray = postsFeed[post.type] == null ? [] : postsFeed[post.type];
			feedArray.push(post);
			postsFeed[post.type] = feedArray;
		}
	});

	newState.list = array;
	newState.map = postsMap;
	newState.feed = postsFeed;
	return newState;
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? initialState : arguments[0];


	switch (action.type) {

		case constants.POSTS_RECEIVED:
			//			console.log('POSTS_RECEIVED')
			return update(state, action.posts);

		default:
			return state;
	}
};