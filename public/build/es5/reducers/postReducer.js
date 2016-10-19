"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	posts: {}, // organized by slug
	postsArray: []
};


var update = function (state, posts) {
	var newState = Object.assign({}, state);
	var array = Object.assign([], newState.postsArray);
	var postsMap = Object.assign({}, newState.posts);

	posts.forEach(function (post) {
		if (postsMap[post.id] == null) {
			postsMap[post.id] = post;
			array.push(post);
		}
	});

	newState.postsArray = array;
	newState.posts = postsMap;
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
}



// }
;