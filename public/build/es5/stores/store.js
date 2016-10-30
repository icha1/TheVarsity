"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _redux = require("redux");

var createStore = _redux.createStore;
var combineReducers = _redux.combineReducers;
var applyMiddleware = _redux.applyMiddleware;
var thunk = _interopRequire(require("redux-thunk"));

var _reducers = require("../reducers");

var postReducer = _reducers.postReducer;
var districtReducer = _reducers.districtReducer;
var teamReducer = _reducers.teamReducer;
var accountReducer = _reducers.accountReducer;
var sessionReducer = _reducers.sessionReducer;


var store;

module.exports = {

	configureStore: function (initial) {
		var reducers = combineReducers({
			post: postReducer,
			team: teamReducer,
			session: sessionReducer,
			district: districtReducer,
			account: accountReducer
		});

		store = createStore(reducers, initial, applyMiddleware(thunk));

		return store;
	},


	currentStore: function () {
		return store;
	}
};