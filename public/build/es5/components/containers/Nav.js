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

var Modal = require("react-bootstrap").Modal;
var APIManager = require("../../utils").APIManager;
var _reactRouter = require("react-router");

var Link = _reactRouter.Link;
var browserHistory = _reactRouter.browserHistory;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var connect = require("react-redux").connect;
var Nav = (function (Component) {
	function Nav(props, context) {
		_classCallCheck(this, Nav);

		_get(Object.getPrototypeOf(Nav.prototype), "constructor", this).call(this, props, context);
		this.sendCredentials = this.sendCredentials.bind(this);
		this.state = {
			showLogin: false,
			showRegister: false,
			credentials: {
				email: "",
				username: "",
				password: ""
			}
		};
	}

	_inherits(Nav, Component);

	_prototypeProperties(Nav, null, {
		toggleLogin: {
			value: function toggleLogin(event) {
				if (event) event.preventDefault();

				this.setState({
					showLogin: !this.state.showLogin
				});
			},
			writable: true,
			configurable: true
		},
		toggleRegister: {
			value: function toggleRegister(event) {
				if (event) event.preventDefault();

				this.setState({
					showRegister: !this.state.showRegister
				});
			},
			writable: true,
			configurable: true
		},
		updateCredentials: {
			value: function updateCredentials(event) {
				var updatedCredentials = Object.assign({}, this.state.credentials);
				updatedCredentials[event.target.id] = event.target.value;

				this.setState({
					credentials: updatedCredentials
				});
			},
			writable: true,
			configurable: true
		},
		login: {
			value: function login(event) {
				if (event) event.preventDefault();

				this.sendCredentials("/account/login");
			},
			writable: true,
			configurable: true
		},
		register: {
			value: function register(event) {
				if (event) event.preventDefault();

				this.sendCredentials("/account/register");
			},
			writable: true,
			configurable: true
		},
		sendCredentials: {
			value: function sendCredentials(endpoint) {
				var _this = this;
				APIManager.handlePost(endpoint, this.state.credentials, function (err, response) {
					if (err) {
						alert(err.message);
						return;
					}

					_this.setState({
						showRegister: false,
						showLogin: false
					});

					store.currentStore().dispatch(actions.currentUserReceived(response.user));
					browserHistory.push("/account");
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var style = styles.nav;

				var accountLink = undefined,
				    joinLink = undefined,
				    loginLink = null;
				if (this.props.user == null) {
					joinLink = React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ onClick: this.toggleRegister.bind(this), href: "#" },
							React.createElement(
								"div",
								null,
								"Join"
							)
						)
					);
					loginLink = React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ onClick: this.toggleLogin.bind(this), href: "#" },
							React.createElement(
								"div",
								null,
								"Login"
							)
						)
					);
				} else {
					accountLink = React.createElement(
						"li",
						null,
						React.createElement(
							Link,
							{ to: "/account" },
							React.createElement(
								"div",
								null,
								this.props.user.username
							)
						)
					);
				}

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
									joinLink,
									loginLink,
									accountLink
								)
							),
							React.createElement(
								"div",
								{ id: "page-submenu-trigger" },
								React.createElement("i", { className: "icon-reorder" })
							)
						)
					),
					React.createElement(
						Modal,
						{ bsSize: "sm", show: this.state.showLogin, onHide: this.toggleLogin.bind(this) },
						React.createElement(
							Modal.Body,
							{ style: style.modal },
							React.createElement(
								"div",
								{ style: { textAlign: "center" } },
								React.createElement("img", { style: style.logo, src: "/images/logo_round_blue_260.png" }),
								React.createElement(
									"h4",
									null,
									"Log In"
								)
							),
							React.createElement("input", { onChange: this.updateCredentials.bind(this), id: "email", className: style.textField.className, style: style.textField, type: "text", placeholder: "Email" }),
							React.createElement("input", { onChange: this.updateCredentials.bind(this), id: "password", className: style.textField.className, style: style.textField, type: "password", placeholder: "Password" }),
							React.createElement(
								"div",
								{ style: style.btnLoginContainer },
								React.createElement(
									"a",
									{ onClick: this.login.bind(this), href: "#", className: style.btnLogin.className },
									React.createElement("i", { className: "icon-lock3" }),
									"Log In"
								)
							)
						)
					),
					React.createElement(
						Modal,
						{ show: this.state.showRegister, onHide: this.toggleRegister.bind(this) },
						React.createElement(
							Modal.Body,
							{ style: style.modal },
							React.createElement(
								"div",
								{ style: { textAlign: "center" } },
								React.createElement("img", { style: style.logo, src: "/images/logo_round_blue_260.png" }),
								React.createElement(
									"h4",
									null,
									"Sign Up"
								)
							),
							React.createElement("hr", null),
							React.createElement(
								"div",
								{ className: "col_half" },
								React.createElement(
									"div",
									{ style: { padding: 16, background: "#fff", border: "1px solid #ddd" } },
									"Sign Up"
								)
							),
							React.createElement(
								"div",
								{ className: "col_half col_last" },
								React.createElement("input", { onChange: this.updateCredentials.bind(this), id: "email", className: style.textField.className, style: style.textField, type: "text", placeholder: "Email" }),
								React.createElement("input", { onChange: this.updateCredentials.bind(this), id: "username", className: style.textField.className, style: style.textField, type: "text", placeholder: "Username" }),
								React.createElement("input", { onChange: this.updateCredentials.bind(this), id: "password", className: style.textField.className, style: style.textField, type: "password", placeholder: "Password" }),
								React.createElement(
									"div",
									{ style: style.btnLoginContainer },
									React.createElement(
										"a",
										{ onClick: this.register.bind(this), href: "#", className: style.btnLogin.className },
										React.createElement("i", { className: "icon-lock3" }),
										"Join"
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

	return Nav;
})(Component);

var stateToProps = function (state) {
	return {
		user: state.account.currentUser
	};
};

module.exports = connect(stateToProps)(Nav);