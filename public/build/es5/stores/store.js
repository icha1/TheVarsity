"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _redux = require("redux");

var createStore = _redux.createStore;
var combineReducers = _redux.combineReducers;
var applyMiddleware = _redux.applyMiddleware;
var thunk = _interopRequire(require("redux-thunk"));

var postReducer = require("../reducers").postReducer;


var store;

module.exports = {

	configureStore: function (initial) {
		var reducers = combineReducers({
			postReducer: postReducer
		});

		store = createStore(reducers, initial, applyMiddleware(thunk));

		return store;
	},


	currentStore: function () {
		return store;
	}
};