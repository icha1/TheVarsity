"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Venues = require("../containers").Venues;
var styles = _interopRequire(require("./styles"));

var Venue = (function (Component) {
	function Venue() {
		_classCallCheck(this, Venue);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Venue, Component);

	_prototypeProperties(Venue, null, {
		componentDidMount: {
			value: function componentDidMount() {
				console.log("componentDidMount: " + this.props.params.slug);
				window.scrollTo(0, 0);
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var style = styles.home;
				return React.createElement(
					"div",
					{ className: "clearfix" },
					React.createElement(
						"header",
						{ id: "header", className: "no-sticky" },
						React.createElement(
							"div",
							{ id: "header-wrap" },
							React.createElement(Venues, null)
						)
					),
					React.createElement(
						"section",
						{ id: "content", style: style.content },
						React.createElement(
							"div",
							{ className: "content-wrap container clearfix" },
							React.createElement(
								"div",
								{ className: "col_full col_last" },
								"Venue Page"
							)
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Venue;
})(Component);

module.exports = Venue;