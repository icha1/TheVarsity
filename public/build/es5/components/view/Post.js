"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Link = require("react-router").Link;
var DateUtils = require("../../utils").DateUtils;
var styles = _interopRequire(require("./styles"));

var Post = (function (Component) {
	function Post() {
		_classCallCheck(this, Post);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(Post, Component);

	_prototypeProperties(Post, null, {
		render: {
			value: function render() {
				var post = this.props.post;
				return React.createElement(
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
								React.createElement("img", { alt: "The Varsity", src: post.venue.image + "=s120-c", className: "avatar avatar-60 photo", height: "60", width: "60" })
							)
						)
					),
					React.createElement(
						"div",
						{ className: styles.post.content.className, style: styles.post.content },
						React.createElement(
							"span",
							{ style: { float: "right" } },
							DateUtils.formattedDate(post.timestamp)
						),
						React.createElement(
							"h2",
							{ style: styles.post.header },
							React.createElement(
								Link,
								{ to: "/venue/" + post.venue.slug, style: styles.post.title },
								post.title
							)
						),
						React.createElement(
							"p",
							{ style: { marginTop: 0 } },
							post.text
						),
						React.createElement("img", { style: styles.postImage, src: post.image })
					),
					React.createElement("hr", null),
					React.createElement(
						"h4",
						{ style: styles.post.header },
						React.createElement(
							Link,
							{ to: "/venue/" + post.venue.slug, style: styles.post.title },
							post.title
						)
					),
					React.createElement(
						"span",
						null,
						post.venue.address
					),
					React.createElement("div", { className: "clear" })
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Post;
})(Component);

module.exports = Post;