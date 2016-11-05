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
var _utils = require("../../utils");

var APIManager = _utils.APIManager;
var DateUtils = _utils.DateUtils;
var _view = require("../view");

var Post = _view.Post;
var CreatePost = _view.CreatePost;
var store = _interopRequire(require("../../stores/store"));

var actions = _interopRequire(require("../../actions/actions"));

var styles = _interopRequire(require("./styles"));

var Posts = (function (Component) {
	function Posts() {
		_classCallCheck(this, Posts);

		_get(Object.getPrototypeOf(Posts.prototype), "constructor", this).call(this);
		this.fetchPosts = this.fetchPosts.bind(this);
		this.state = {
			showCreate: false
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
		toggleShowCreate: {
			value: function toggleShowCreate(event) {
				if (event != null) event.preventDefault();

				window.scrollTo(0, 0);
				this.setState({
					showCreate: !this.state.showCreate
				});
			},
			writable: true,
			configurable: true
		},
		toggleLoader: {
			value: function toggleLoader(isLoading) {
				this.props.toggleLoader(isLoading);
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

					_this.props.postsReceived(response.results);
					_this.setState({ showCreate: false });
				});
			},
			writable: true,
			configurable: true
		},
		submitPost: {
			value: function submitPost(post) {
				// event.preventDefault()
				console.log("submitPost: " + JSON.stringify(post));
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

				var createPost = React.createElement(CreatePost, {
					type: this.props.selectedFeed,
					user: this.props.user,
					teams: this.props.teams,
					isLoading: this.toggleLoader.bind(this),
					submit: this.submitPost.bind(this),
					cancel: this.toggleShowCreate.bind(this) });

				return React.createElement(
					"div",
					null,
					React.createElement(
						"ol",
						{ className: "commentlist noborder nomargin nopadding clearfix" },
						React.createElement(
							"li",
							{ className: "comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1", id: "li-comment-2" },
							this.state.showCreate ? createPost : currentPosts
						)
					),
					this.state.showCreate ? null : React.createElement(
						"a",
						{ href: "#", onClick: this.toggleShowCreate.bind(this), style: { position: "fixed", bottom: 0 }, className: styles.post.btnAdd.className },
						"Add Event"
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

var mapDispatchToProps = function (dispatch) {
	return {
		postsReceived: function (posts) {
			return dispatch(actions.postsReceived(posts));
		},
		toggleLoader: function (isLoading) {
			return dispatch(actions.toggleLoader(isLoading));
		}
	};
};

module.exports = connect(stateToProps, mapDispatchToProps)(Posts);