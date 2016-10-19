"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var APIManager = require("../../utils").APIManager;
var store = _interopRequire(require("../../stores/store"));

var actions = _interopRequire(require("../../actions/actions"));

var connect = require("react-redux").connect;
var Map = require("../view").Map;
var Venues = (function (Component) {
	function Venues() {
		_classCallCheck(this, Venues);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Venues, Component);

	_prototypeProperties(Venues, null, {
		componentDidMount: {
			value: function componentDidMount() {},
			writable: true,
			configurable: true
		},
		locationChanged: {
			value: function locationChanged(location) {
				console.log("locationChanged");
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				return React.createElement(Map, { center: this.props.location, zoom: 16, mapMoved: this.locationChanged.bind(this) });
			},
			writable: true,
			configurable: true
		}
	});

	return Venues;
})(Component);

var stateToProps = function (state) {
	return {
		location: state.locationReducer.currentLocation
	};
};

module.exports = connect(stateToProps)(Venues);