"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var styles = _interopRequire(require("./styles"));

var Account = (function (Component) {
	function Account() {
		_classCallCheck(this, Account);

		_get(Object.getPrototypeOf(Account.prototype), "constructor", this).call(this);
		this.state = {
			selected: 0,
			menuItems: [{ name: "Listings", component: "Posts" }, { name: "Submit Listing", component: "CreatePost" }, { name: "Manage Notifications", component: "ManageNotifications" }]
		};
	}

	_inherits(Account, Component);

	_prototypeProperties(Account, null, {
		selectItem: {
			value: function selectItem(index, event) {
				event.preventDefault();

				var item = this.state.menuItems;
				this.setState({
					selected: index
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var _this = this;
				var style = styles.account;

				var sideMenu = this.state.menuItems.map(function (item, i) {
					var itemStyle = i == _this.state.selected ? style.selected : style.menuItem;
					return React.createElement(
						"li",
						{ key: i },
						React.createElement(
							"div",
							{ style: itemStyle },
							React.createElement(
								"a",
								{ onClick: _this.selectItem.bind(_this, i), href: "#" },
								React.createElement(
									"div",
									null,
									item.name
								)
							)
						)
					);
				});

				return React.createElement(
					"div",
					{ className: "clearfix" },
					React.createElement(
						"header",
						{ id: "header", className: "no-sticky" },
						React.createElement(
							"div",
							{ id: "header-wrap" },
							React.createElement(
								"div",
								{ className: "container clearfix" },
								React.createElement(
									"nav",
									{ id: "primary-menu", style: { paddingTop: 96 } },
									React.createElement(
										"ul",
										null,
										sideMenu
									)
								)
							)
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
								{ className: "col_two_third" },
								"Account Page"
							)
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Account;
})(Component);

module.exports = Account;