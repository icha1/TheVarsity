"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Loader = _interopRequire(require("react-loader"));

var Nav = require("./containers").Nav;
var connect = require("react-redux").connect;
var Main = (function (Component) {
	function Main() {
		_classCallCheck(this, Main);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Main, Component);

	_prototypeProperties(Main, null, {
		render: {
			value: function render() {
				return React.createElement(
					"div",
					{ className: "stretched side-header" },
					React.createElement(Loader, { options: styles.loader, loaded: !this.props.showLoading, className: "spinner", loadedClassName: "loadedContent" }),
					React.createElement(Nav, null),
					React.createElement(
						"div",
						{ id: "wrapper" },
						this.props.children
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Main;
})(Component);

var styles = {
	loader: {
		lines: 13,
		length: 20,
		width: 10,
		radius: 30,
		corners: 1,
		rotate: 0,
		direction: 1,
		color: "#fff",
		speed: 1,
		trail: 60,
		shadow: false,
		hwaccel: false,
		zIndex: 2000000000,
		top: "50%",
		left: "50%",
		scale: 1
	}
};

var stateToProps = function (state) {
	return {
		showLoading: state.session.showLoading
	};
};

module.exports = connect(stateToProps)(Main);