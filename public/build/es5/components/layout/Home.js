"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var _containers = require("../containers");

var Posts = _containers.Posts;
var Venues = _containers.Venues;
var styles = _interopRequire(require("./styles"));

var Home = (function (Component) {
	function Home() {
		_classCallCheck(this, Home);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Home, Component);

	_prototypeProperties(Home, null, {
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
								{ className: "col_half" },
								React.createElement(Posts, null)
							),
							React.createElement(
								"div",
								{ className: "col_half col_last" },
								React.createElement(
									"div",
									{ className: "feature-box center media-box fbox-bg" },
									React.createElement(
										"div",
										{ className: "fbox-desc" },
										React.createElement(
											"div",
											{ style: { padding: 25, borderTop: "1px solid #ddd" } },
											React.createElement(
												"h3",
												null,
												"Chat"
											)
										),
										React.createElement(
											"div",
											{ style: style.container },
											React.createElement(
												"div",
												{ style: style.dateBox },
												"line 1",
												React.createElement("br", null),
												"username"
											),
											React.createElement(
												"div",
												{ style: style.body },
												React.createElement(
													"span",
													{ style: style.header },
													"Title"
												),
												React.createElement("br", null)
											)
										),
										React.createElement(
											"div",
											{ style: style.container },
											React.createElement(
												"div",
												{ style: style.dateBox },
												"line 1",
												React.createElement("br", null),
												"username"
											),
											React.createElement(
												"div",
												{ style: style.body },
												React.createElement(
													"span",
													{ style: style.header },
													"Title"
												),
												React.createElement("br", null)
											)
										)
									)
								)
							)
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Home;
})(Component);

module.exports = Home;