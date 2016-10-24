"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

		_get(Object.getPrototypeOf(Venues.prototype), "constructor", this).call(this);
		this.fetchVenues = this.fetchVenues.bind(this);
		this.fetchDistrict = this.fetchDistrict.bind(this);
		this.calculateDistance = this.calculateDistance.bind(this);
		this.state = {};
	}

	_inherits(Venues, Component);

	_prototypeProperties(Venues, null, {
		componentDidMount: {
			value: function componentDidMount() {
				if (this.props.venues.length == 0) this.fetchVenues(this.props.location);
			},
			writable: true,
			configurable: true
		},
		calculateDistance: {
			value: function calculateDistance(location) {
				var currentLocation = this.props.location;
				var deltaX = currentLocation.lat - location.lat;
				var deltaY = currentLocation.lng - location.lng;
				var cSquared = deltaY * deltaY + deltaX * deltaX;
				var dist = Math.sqrt(cSquared);
				return dist;
			},
			writable: true,
			configurable: true
		},
		locationChanged: {
			value: function locationChanged(location) {
				console.log("locationChanged: " + JSON.stringify(location));
				console.log("currentLocation: " + JSON.stringify(this.props.location));
				var distance = this.calculateDistance(location);
				console.log("Distance: " + JSON.stringify(distance));

				if (distance < 0.01) {
					return;
				}this.fetchVenues(location);
			},
			writable: true,
			configurable: true
		},
		fetchVenues: {
			value: function fetchVenues(location) {
				var _this = this;
				APIManager.handleGet("/api/venue", location, function (err, response) {
					if (err) {
						alert(err);
						return;
					}

					store.currentStore().dispatch(actions.venuesReceived(response.results));
					_this.fetchDistrict();
				});
			},
			writable: true,
			configurable: true
		},
		fetchDistrict: {
			value: function fetchDistrict() {
				console.log("fetchDistrict");

				var params = {
					limit: 1,
					lat: this.props.location.lat,
					lng: this.props.location.lng
				};

				APIManager.handleGet("/api/district", params, function (err, response) {
					if (err) {
						alert(err);
						return;
					}

					//			console.log(JSON.stringify(response))
					store.currentStore().dispatch(actions.districtChanged(response.results));
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				return React.createElement(Map, {
					center: this.props.location,
					zoom: 16,
					markers: this.props.venues,
					mapMoved: this.locationChanged.bind(this) });
			},
			writable: true,
			configurable: true
		}
	});

	return Venues;
})(Component);

var stateToProps = function (state) {
	return {
		location: state.location.currentLocation,
		venues: state.venue.list
	};
};

module.exports = connect(stateToProps)(Venues);