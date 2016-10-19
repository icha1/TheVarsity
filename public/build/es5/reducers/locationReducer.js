"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	currentLocation: { // default to nyc
		lat: 40.731226699890954,
		lng: -73.99580480799563

	}
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? initialState : arguments[0];


	switch (action.type) {

		case constants.LOCATION_CHANGED:
			console.log("LOCATION_CHANGED");
			var newState = Object.assign({}, state);
			newState.currentLocation = action.location;

			return newState;

		default:
			return state;
	}
};