"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	map: {}, // organized by slug
	list: []
};


var update = function (state, posts) {
	var newState = Object.assign({}, state);
	var array = Object.assign([], newState.list);
	var postsMap = Object.assign({}, newState.map);

	posts.forEach(function (post) {
		if (postsMap[post.id] == null) {
			postsMap[post.id] = post;
			array.push(post);
		}
	});

	newState.list = array;
	newState.map = postsMap;
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