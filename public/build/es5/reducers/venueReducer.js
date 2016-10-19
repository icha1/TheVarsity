"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	venues: {}, // organized by slug
	venuesArray: []
};


var update = function (state, venues) {
	var newState = Object.assign({}, state);
	var array = Object.assign([], newState.venuesArray);
	var venuesMap = Object.assign({}, newState.venues);

	venues.forEach(function (venue) {
		if (venuesMap[venue.id] == null) {
			venuesMap[venue.id] = venue;
			array.push(venue);
		}
	});

	newState.venuesArray = array;
	newState.venues = venuesMap;
	return newState;
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? initialState : arguments[0];


	switch (action.type) {

		case constants.VENUES_RECEIVED:
			console.log("VENUES_RECEIVED");
			return update(state, action.venues);

		default:
			return state;
	}
}



// }
;