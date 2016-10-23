"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var APIManager = require("../../utils").APIManager;
var Post = require("../view").Post;
var store = _interopRequire(require("../../stores/store"));

var actions = _interopRequire(require("../../actions/actions"));

var connect = require("react-redux").connect;
var Posts = (function (Component) {
	function Posts() {
		_classCallCheck(this, Posts);

		_get(Object.getPrototypeOf(Posts.prototype), "constructor", this).call(this);
		this.state = {};
	}

	_inherits(Posts, Component);

	_prototypeProperties(Posts, null, {
		componentDidMount: {
			value: function componentDidMount() {
				APIManager.handleGet("/api/post", this.props.currentLocation, function (err, response) {
					if (err) {
						alert(err);
						return;
					}

					//			console.log(JSON.stringify(response.results))
					store.currentStore().dispatch(actions.postsReceived(response.results));
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var currentPosts = this.props.posts.map(function (post, i) {
					return React.createElement(
						"li",
						{ key: post.id, className: "comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1", id: "li-comment-2" },
						React.createElement(Post, { post: post })
					);
				});

				return React.createElement(
					"div",
					{ className: "content-wrap container clearfix" },
					React.createElement(
						"div",
						{ className: "col_half" },
						React.createElement(
							"ol",
							{ className: "commentlist noborder nomargin nopadding clearfix" },
							currentPosts
						)
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
		posts: state.post.list,
		location: state.location.currentLocation
	};
};

module.exports = connect(stateToProps)(Posts);