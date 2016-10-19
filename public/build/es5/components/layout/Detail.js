"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Venue = require("../containers").Venue;
var styles = _interopRequire(require("./styles"));

var Detail = (function (Component) {
	function Detail() {
		_classCallCheck(this, Detail);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Detail, Component);

	_prototypeProperties(Detail, null, {
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
				return React.createElement(Venue, { slug: this.props.params.slug });
			},
			writable: true,
			configurable: true
		}
	});

	return Detail;
})(Component);

module.exports = Detail;