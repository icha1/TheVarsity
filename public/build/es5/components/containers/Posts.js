"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Modal = require("react-bootstrap").Modal;
var connect = require("react-redux").connect;
var Dropzone = _interopRequire(require("react-dropzone"));

var _utils = require("../../utils");

var APIManager = _utils.APIManager;
var DateUtils = _utils.DateUtils;
var Post = require("../view").Post;
var store = _interopRequire(require("../../stores/store"));

var actions = _interopRequire(require("../../actions/actions"));

var styles = _interopRequire(require("./styles"));

var Posts = (function (Component) {
	function Posts() {
		_classCallCheck(this, Posts);

		_get(Object.getPrototypeOf(Posts.prototype), "constructor", this).call(this);
		this.fetchPosts = this.fetchPosts.bind(this);
		this.state = {
			showCreatePost: false,
			post: {
				title: "",
				text: "",
				type: "",
				image: "",
				profile: {},
				team: {}
			}
		};
	}

	_inherits(Posts, Component);

	_prototypeProperties(Posts, null, {
		componentDidMount: {
			value: function componentDidMount() {
				var _this = this;
				store.currentStore().subscribe(function () {
					setTimeout(function () {
						// this is a sloppy workaround
						console.log("RELOAD: " + _this.props.selectedFeed + ", " + _this.props.reload);
						if (_this.props.reload) _this.fetchPosts();
					}, 5);
				});

				this.fetchPosts();
			},
			writable: true,
			configurable: true
		},
		toggleCreatePost: {
			value: function toggleCreatePost(event) {
				if (event != null) event.preventDefault();

				window.scrollTo(0, 0);
				this.setState({
					showCreatePost: !this.state.showCreatePost
				});
			},
			writable: true,
			configurable: true
		},
		fetchPosts: {
			value: function fetchPosts() {
				var _this = this;
				var params = {
					limit: 10,
					type: this.props.selectedFeed,
					lat: this.props.location.lat,
					lng: this.props.location.lng
				};

				APIManager.handleGet("/api/post", params, function (err, response) {
					if (err) {
						alert(err);
						return;
					}

					store.currentStore().dispatch(actions.postsReceived(response.results));
					_this.setState({ showCreatePost: false });
				});
			},
			writable: true,
			configurable: true
		},
		updatePost: {
			value: function updatePost(event) {
				event.preventDefault();
				var updated = Object.assign({}, this.state.post);
				updated[event.target.id] = event.target.value;
				this.setState({
					post: updated
				});
			},
			writable: true,
			configurable: true
		},
		submitPost: {
			value: function submitPost(event) {
				event.preventDefault();
				console.log("submitPost: " + JSON.stringify(this.state.post));
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
		render: {
			value: function render() {
				var list = this.props.posts[this.props.selectedFeed];
				var currentPosts = null;
				if (list != null) {
					currentPosts = list.map(function (post, i) {
						return React.createElement(
							"li",
							{ key: post.id, className: "comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1", id: "li-comment-2" },
							React.createElement(Post, { post: post })
						);
					});
				}

				var teamList = this.props.teams.map(function (team, i) {
					return React.createElement(
						"option",
						{ key: i, value: team.id },
						team.name
					);
				});

				var image = this.state.post.image.length == 0 ? "/images/image-placeholder.png" : this.state.post.image;
				var createPost = React.createElement(
					"li",
					{ className: "comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1", id: "li-comment-2" },
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
								this.state.post.profile.username
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
					React.createElement(
						"select",
						{ className: "form-control", style: styles.post.select },
						React.createElement(
							"option",
							null,
							"Events"
						),
						React.createElement(
							"option",
							null,
							"News"
						)
					),
					React.createElement(
						"select",
						{ className: "form-control", style: styles.post.select },
						teamList
					),
					React.createElement(
						"a",
						{ href: "#", onClick: this.submitPost.bind(this), style: styles.post.btnAdd, className: styles.post.btnAdd.className },
						"Create Post"
					),
					React.createElement(
						"a",
						{ href: "#", onClick: this.toggleCreatePost.bind(this), style: styles.post.btnAdd, className: styles.post.btnAdd.className },
						"Cancel"
					)
				);

				return React.createElement(
					"div",
					null,
					React.createElement(
						"ol",
						{ className: "commentlist noborder nomargin nopadding clearfix" },
						this.state.showCreatePost ? createPost : currentPosts
					),
					React.createElement(
						"a",
						{ href: "#", onClick: this.toggleCreatePost.bind(this), style: { position: "fixed", bottom: 0 }, className: styles.post.btnAdd.className },
						"Add Post"
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Posts;
})(Component);

var stateToProps = function (state) {
	return {
		posts: state.post.feed,
		location: state.session.currentLocation,
		selectedFeed: state.session.selectedFeed,
		reload: state.session.reload,
		user: state.account.currentUser,
		teams: state.account.teams
	};
};

module.exports = connect(stateToProps)(Posts);