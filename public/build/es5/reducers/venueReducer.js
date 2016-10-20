"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	map: {}, // organized by slug
	list: []
};


var update = function (state, venues) {
	var newState = Object.assign({}, state);
	var array = Object.assign([], newState.list);
	var venuesMap = Object.assign({}, newState.map);

	venues.forEach(function (venue) {
		if (venuesMap[venue.slug] == null) {
			venuesMap[venue.slug] = venue;
			array.push(venue);
		}
	});

	newState.list = array;
	newState.map = venuesMap;
	return newState;
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? initialState : arguments[0];


	switch (action.type) {

		case constants.VENUES_RECEIVED:
			//			console.log('VENUES_RECEIVED')
			return update(state, action.venues);

		default:
			return state;
	}
}



// }
;