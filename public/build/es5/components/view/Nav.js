"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var styles = _interopRequire(require("./styles"));

var Nav = (function (Component) {
	function Nav() {
		_classCallCheck(this, Nav);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Nav, Component);

	_prototypeProperties(Nav, null, {
		showLogin: {
			value: function showLogin(event) {
				event.preventDefault();
				console.log("showLogin");
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var style = styles.nav;

				return React.createElement(
					"div",
					{ id: "page-menu" },
					React.createElement(
						"div",
						{ id: "page-menu-wrap" },
						React.createElement(
							"div",
							{ className: "container clearfix" },
							React.createElement(
								"div",
								{ className: "menu-title" },
								React.createElement(
									"a",
									{ style: style.title, href: "/" },
									"The Varsity"
								)
							),
							React.createElement(
								"nav",
								{ className: "one-page-menu" },
								React.createElement(
									"ul",
									{ style: style.ul },
									React.createElement(
										"li",
										null,
										React.createElement(
											"a",
											{ href: "#" },
											React.createElement(
												"div",
												null,
												"About"
											)
										)
									),
									React.createElement(
										"li",
										null,
										React.createElement(
											"a",
											{ href: "#" },
											React.createElement(
												"div",
												null,
												"Join"
											)
										)
									),
									React.createElement(
										"li",
										null,
										React.createElement(
											"a",
											{ onClick: this.showLogin.bind(this), href: "#" },
											React.createElement(
												"div",
												null,
												"Login"
											)
										)
									)
								)
							),
							React.createElement(
								"div",
								{ id: "page-submenu-trigger" },
								React.createElement("i", { className: "icon-reorder" })
							)
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Nav;
})(Component);

module.exports = Nav;