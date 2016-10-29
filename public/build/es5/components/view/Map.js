"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var _reactGoogleMaps = require("react-google-maps");

var GoogleMapLoader = _reactGoogleMaps.GoogleMapLoader;
var GoogleMap = _reactGoogleMaps.GoogleMap;
var Marker = _reactGoogleMaps.Marker;
var Circle = _reactGoogleMaps.Circle;
// https://github.com/tomchentw/react-google-maps
var browserHistory = require("react-router").browserHistory;
var Map = (function (Component) {
	function Map(props, context) {
		_classCallCheck(this, Map);

		_get(Object.getPrototypeOf(Map.prototype), "constructor", this).call(this, props, context);
		this.state = {
			map: null
		};
	}

	_inherits(Map, Component);

	_prototypeProperties(Map, null, {
		mapDragged: {
			value: function mapDragged() {
				var latLng = this.state.map.getCenter().toJSON();
				if (this.props.mapMoved != null) this.props.mapMoved(latLng);
			},
			writable: true,
			configurable: true
		},
		handleMarkerClick: {
			value: function handleMarkerClick(marker) {
				console.log("MarkerClick: " + JSON.stringify(marker));
				browserHistory.push("/team/" + marker.slug);
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var _this = this;
				var markers = null;
				if (this.props.markers != null) {
					markers = this.props.markers.map(function (marker, i) {
						marker.defaultAnimation = _this.props.animation;
						marker.icon = marker.image + "=s60-c";
						marker.position = {
							lat: marker.geo[0],
							lng: marker.geo[1]
						};

						return React.createElement(Marker, _extends({
							key: i,
							clickable: true,
							icon: marker.icon,
							label: marker.title,
							title: marker.key,
							onClick: _this.handleMarkerClick.bind(_this, marker)
						}, marker));
					});
				}

				var mapContainer = React.createElement("div", { style: { height: "100%", width: "100%" } });
				return React.createElement(GoogleMapLoader, {
					containerElement: mapContainer,
					googleMapElement: React.createElement(
						GoogleMap,
						{
							ref: function (map) {
								if (_this.state.map != null) return;

								_this.setState({ map: map });
							},

							onDragend: this.mapDragged.bind(this),
							defaultZoom: this.props.zoom,
							defaultCenter: this.props.center,
							options: { streetViewControl: false, mapTypeControl: false } },
						markers
					) });
			},
			writable: true,
			configurable: true
		}
	});

	return Map;
})(Component);

module.exports = Map;