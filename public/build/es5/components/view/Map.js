"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var _reactGoogleMaps = require("react-google-maps");

var GoogleMapLoader = _reactGoogleMaps.GoogleMapLoader;
var GoogleMap = _reactGoogleMaps.GoogleMap;
var Marker = _reactGoogleMaps.Marker;
// https://github.com/tomchentw/react-google-maps


var Map = (function (Component) {
	function Map() {
		_classCallCheck(this, Map);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Map, Component);

	_prototypeProperties(Map, null, {
		render: {
			value: function render() {
				var mapContainer = React.createElement("div", { style: { height: "100%", width: "100%" } });
				var ctr = {
					lat: 40.7359745,
					lng: -73.9879513
				};

				return React.createElement(GoogleMapLoader, {
					containerElement: mapContainer,
					googleMapElement: React.createElement(GoogleMap, {
						defaultZoom: 16,
						defaultCenter: ctr,
						options: { streetViewControl: false, mapTypeControl: false } }) });
			},
			writable: true,
			configurable: true
		}
	});

	return Map;
})(Component);

module.exports = Map;