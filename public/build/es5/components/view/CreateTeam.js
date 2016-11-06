"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Dropzone = _interopRequire(require("react-dropzone"));

var _utils = require("../../utils");

var APIManager = _utils.APIManager;
var DateUtils = _utils.DateUtils;
var styles = _interopRequire(require("./styles"));

var CreateTeam = (function (Component) {
	function CreateTeam() {
		_classCallCheck(this, CreateTeam);

		_get(Object.getPrototypeOf(CreateTeam.prototype), "constructor", this).call(this);
		this.state = {
			team: {
				name: "",
				description: "",
				image: ""
			}
		};
	}

	_inherits(CreateTeam, Component);

	_prototypeProperties(CreateTeam, null, {
		uploadImage: {
			value: function uploadImage(files) {
				var _this = this;
				this.props.isLoading(true);
				APIManager.upload(files[0], function (err, image) {
					_this.props.isLoading(false);
					if (err) {
						alert(err);
						return;
					}

					// let updated = Object.assign({}, this.state.post)
					// updated['image'] = image.address+'=s220-c'
					// this.setState({post: updated})
				});
			},
			writable: true,
			configurable: true
		},
		updateTeam: {
			value: function updateTeam(event) {},
			writable: true,
			configurable: true
		},
		submitTeam: {
			value: function submitTeam() {
				event.preventDefault();
			},
			writable: true,
			configurable: true
		},
		cancel: {
			value: function cancel(event) {
				event.preventDefault();
				this.props.cancel();
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var team = this.state.team;
				var image = team.image.length == 0 ? "/images/image-placeholder.png" : team.image;

				return React.createElement(
					"div",
					null,
					React.createElement(
						"div",
						{ className: styles.post.container.className, style: styles.post.container },
						React.createElement(
							"div",
							{ className: "comment-meta" },
							React.createElement(
								"div",
								{ className: "comment-author vcard" },
								React.createElement(
									"span",
									{ className: "comment-avatar clearfix" },
									React.createElement("img", { alt: "The Varsity", src: "/images/profile-icon.png", className: "avatar avatar-60 photo", height: "60", width: "60" })
								)
							)
						),
						React.createElement(
							"div",
							{ className: styles.post.content.className, style: styles.post.content },
							React.createElement(
								"div",
								{ className: "col_two_third", style: { marginBottom: 4 } },
								React.createElement("input", { id: "title", onChange: this.updateTeam.bind(this), type: "text", placeholder: "Team Name", style: styles.post.input }),
								React.createElement("br", null),
								React.createElement("textarea", { id: "text", onChange: this.updateTeam.bind(this), placeholder: "Description", style: styles.post.textarea }),
								React.createElement("br", null)
							),
							React.createElement(
								Dropzone,
								{ onDrop: this.uploadImage.bind(this), className: "col_one_third col_last", style: { marginBottom: 4 } },
								React.createElement("img", { style: styles.post.postImage, src: image })
							)
						)
					),
					React.createElement("br", null),
					React.createElement(
						"label",
						null,
						"Address"
					),
					React.createElement("input", { id: "street", type: "text", placeholder: "123 Main St.", style: styles.post.select, className: "form-control" }),
					React.createElement("br", null),
					React.createElement(
						"label",
						null,
						"Invite Members"
					),
					React.createElement("input", { id: "members", type: "text", placeholder: "address@example.com, address2@example2.com, address3@example3.com", style: styles.post.select, className: "form-control" }),
					React.createElement("br", null),
					React.createElement(
						"a",
						{ href: "#", onClick: this.submitTeam.bind(this), style: styles.post.btnAdd, className: styles.post.btnAdd.className },
						"Create Team"
					),
					React.createElement(
						"a",
						{ href: "#", onClick: this.cancel.bind(this), style: styles.post.btnAdd, className: styles.post.btnAdd.className },
						"Cancel"
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return CreateTeam;
})(Component);

module.exports = CreateTeam;