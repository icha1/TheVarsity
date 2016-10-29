"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initialState = {
	map: {}, // organized by slug
	list: []
};


var update = function (state, teams) {
	var newState = Object.assign({}, state);
	var array = Object.assign([], newState.list);
	var teamsMap = Object.assign({}, newState.map);

	teams.forEach(function (team) {
		if (teamsMap[team.slug] == null) {
			teamsMap[team.slug] = team;
			array.push(team);
		}
	});

	newState.list = array;
	newState.map = teamsMap;
	return newState;
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? initialState : arguments[0];


	switch (action.type) {

		case constants.TEAMS_RECEIVED:
			//			console.log('VENUES_RECEIVED')
			return update(state, action.teams);

		default:
			return state;
	}
};