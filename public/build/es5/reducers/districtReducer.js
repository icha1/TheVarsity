"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	currentDistrict: {
		id: null,
		name: ""
	}
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? initialState : arguments[0];


	switch (action.type) {

		case constants.DISTRICT_CHANGED:
			console.log("DISTRICT_CHANGED");
			var newState = Object.assign({}, state);
			var list = action.districts;
			if (list.length == 0) return newState;

			var district = list[0];
			newState.currentDistrict = district;
			return newState;

		default:
			return state;
	}
};