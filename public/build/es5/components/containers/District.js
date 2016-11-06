"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Dropzone = _interopRequire(require("react-dropzone"));

var connect = require("react-redux").connect;
var APIManager = require("../../utils").APIManager;
var actions = _interopRequire(require("../../actions/actions"));

var styles = _interopRequire(require("./styles"));

var District = (function (Component) {
	function District() {
		_classCallCheck(this, District);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(District, Component);

	_prototypeProperties(District, null, {
		selectFeed: {
			value: function selectFeed(event) {
				event.preventDefault();
				this.props.changeSelectedFeed(event.target.id);
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var style = styles.district;
				var district = this.props.district;

				return React.createElement(
					"div",
					{ className: "feature-box center media-box fbox-bg" },
					React.createElement(
						"div",
						{ className: "fbox-desc" },
						React.createElement(
							"div",
							{ style: style.title },
							React.createElement(
								"h3",
								null,
								"District"
							)
						),
						React.createElement(
							"div",
							{ style: { borderTop: "1px solid #ddd", minHeight: 140 } },
							React.createElement(
								"div",
								{ style: style.body },
								React.createElement(
									"span",
									{ style: style.header },
									district.name
								),
								React.createElement("br", null),
								React.createElement(
									"ul",
									{ style: style.list },
									React.createElement(
										"li",
										null,
										React.createElement(
											"a",
											{ id: "event", onClick: this.selectFeed.bind(this), href: "#" },
											"Events"
										)
									),
									React.createElement(
										"li",
										null,
										React.createElement(
											"a",
											{ id: "post", onClick: this.selectFeed.bind(this), href: "#" },
											"News"
										)
									),
									React.createElement(
										"li",
										null,
										React.createElement(
											"a",
											{ id: "team", onClick: this.selectFeed.bind(this), href: "#" },
											"Teams"
										)
									)
								)
							)
						),
						React.createElement(
							"div",
							{ style: style.container },
							React.createElement(
								"div",
								{ style: style.rightBox },
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
								{ style: style.rightBox },
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
								{ style: style.rightBox },
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
								{ style: style.rightBox },
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
				);
			},
			writable: true,
			configurable: true
		}
	});

	return District;
})(Component);

var stateToProps = function (state) {
	return {
		location: state.session.currentLocation,
		district: state.session.currentDistrict
	};
};

var dispatchToProps = function (dispatch) {
	return {
		changeSelectedFeed: function (feed) {
			return dispatch(actions.selectedFeedChanged(feed));
		}
	};
};

module.exports = connect(stateToProps, dispatchToProps)(District);