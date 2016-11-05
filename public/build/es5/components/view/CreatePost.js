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

var CreatePost = (function (Component) {
	function CreatePost() {
		_classCallCheck(this, CreatePost);

		_get(Object.getPrototypeOf(CreatePost.prototype), "constructor", this).call(this);
		this.state = {
			post: {
				title: "",
				text: "",
				type: "",
				image: "",
				author: {}
			}
		};
	}

	_inherits(CreatePost, Component);

	_prototypeProperties(CreatePost, null, {
		componentDidMount: {
			value: function componentDidMount() {
				var user = this.props.user;
				var updatedPost = Object.assign({}, this.state.post);
				updatedPost.author = {
					id: user.id,
					name: user.username,
					image: user.image.length == 0 ? null : user.image
				};

				this.setState({
					post: updatedPost
				});
			},
			writable: true,
			configurable: true
		},
		updatePost: {
			value: function updatePost(event) {
				event.preventDefault();
				var updated = Object.assign({}, this.state.post);
				if (event.target.id != "author") {
					updated[event.target.id] = event.target.value;
					this.setState({ post: updated });
					return;
				}

				console.log("author = " + event.target.value);
				if (event.target.value == this.props.user.id) {
					var user = this.props.user;
					updated.author = {
						id: user.id,
						name: user.username,
						image: user.image.length == 0 ? null : user.image,
						type: "profile"
					};
					this.setState({ post: updated });
					return;
				}

				var team = this.props.teams[event.target.value];

				updated.author = {
					id: team.id,
					name: team.name,
					image: team.image.length == 0 ? null : team.image,
					type: "team"
				};
				this.setState({ post: updated });
			},
			writable: true,
			configurable: true
		},
		uploadImage: {
			value: function uploadImage(files) {
				var _this = this;
				APIManager.upload(files[0], function (err, image) {
					if (err) {
						alert(err);
						return;
					}

					var updated = Object.assign({}, _this.state.post);
					updated.image = image.address;
					_this.setState({ post: updated });
				});
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
		submitPost: {
			value: function submitPost(event) {
				event.preventDefault();
				//		console.log('submitPost: '+JSON.stringify(this.state.post))
				this.props.submit(this.state.post);
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var post = this.state.post;
				var image = post.image.length == 0 ? "/images/image-placeholder.png" : post.image;
				var usernameOption = this.props.user == null ? null : React.createElement(
					"option",
					{ value: this.props.user.id },
					this.props.user.username
				);
				var teamList = this.props.teams.map(function (team, i) {
					return React.createElement(
						"option",
						{ key: i, value: i },
						team.name
					);
				});

				var icon = post.author.image == null ? "/images/profile-icon.png" : post.author.image;

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
									React.createElement("img", { alt: "The Varsity", src: icon, className: "avatar avatar-60 photo", height: "60", width: "60" })
								)
							)
						),
						React.createElement(
							"div",
							{ className: styles.post.content.className, style: styles.post.content },
							React.createElement(
								"div",
								{ className: "col_two_third", style: { marginBottom: 4 } },
								React.createElement("input", { id: "title", onChange: this.updatePost.bind(this), type: "text", placeholder: "Title", style: styles.post.input }),
								React.createElement("br", null),
								React.createElement("textarea", { id: "text", onChange: this.updatePost.bind(this), placeholder: "Text:", style: styles.post.textarea }),
								React.createElement("br", null)
							),
							React.createElement(
								Dropzone,
								{ onDrop: this.uploadImage.bind(this), className: "col_one_third col_last", style: { marginBottom: 4 } },
								React.createElement("img", { style: styles.post.postImage, src: image })
							)
						),
						React.createElement("hr", null),
						React.createElement(
							"h4",
							{ style: styles.post.header },
							React.createElement(
								"a",
								{ href: "#", style: styles.post.title },
								post.author.name
							)
						),
						React.createElement(
							"span",
							null,
							"address"
						),
						React.createElement("br", null),
						React.createElement(
							"span",
							null,
							DateUtils.today()
						)
					),
					React.createElement("br", null),
					React.createElement(
						"label",
						null,
						"Post As"
					),
					React.createElement(
						"select",
						{ id: "author", onChange: this.updatePost.bind(this), className: "form-control", style: styles.post.select },
						usernameOption,
						teamList
					),
					React.createElement(
						"a",
						{ href: "#", onClick: this.submitPost.bind(this), style: styles.post.btnAdd, className: styles.post.btnAdd.className },
						"Create Event"
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

	return CreatePost;
})(Component);

module.exports = CreatePost;