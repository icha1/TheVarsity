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
								React.createElement("img", { alt: "The Varsity", src: post.team.image + "=s120-c", className: "avatar avatar-60 photo", height: "60", width: "60" })
							)
						)
					),
					React.createElement(
						"div",
						{ className: styles.post.content.className, style: styles.post.content },
						React.createElement(
							"div",
							{ className: "col_two_third", style: { marginBottom: 4 } },
							React.createElement(
								"h2",
								{ style: styles.post.header },
								React.createElement(
									Link,
									{ to: "/post/" + post.slug, style: styles.post.title },
									post.title
								)
							),
							React.createElement(
								"p",
								{ style: { marginTop: 0 } },
								post.text
							)
						),
						React.createElement(
							"div",
							{ className: "col_one_third col_last", style: { marginBottom: 4 } },
							React.createElement("img", { style: styles.postImage, src: post.image })
						)
					),
					React.createElement("hr", null),
					React.createElement(
						"h4",
						{ style: styles.post.header },
						React.createElement(
							Link,
							{ to: "/team/" + post.team.slug, style: styles.post.title },
							post.title
						)
					),
					React.createElement(
						"span",
						null,
						post.team.address
					),
					React.createElement("br", null),
					React.createElement(
						"span",
						null,
						DateUtils.formattedDate(post.timestamp)
					),
					React.createElement(
						"div",
						{ style: { float: "right" }, className: "dropdown" },
						React.createElement(
							"a",
							{ href: "#", style: { border: "none" }, className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "true" },
							React.createElement("img", { style: { width: 32, float: "right" }, src: "/images/dots.png" })
						),
						React.createElement(
							"ul",
							{ className: "dropdown-menu dropdown-menu-right", "aria-labelledby": "dropdownMenu1" },
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "#" },
									"Profile"
								)
							),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "#" },
									"Messages ",
									React.createElement(
										"span",
										{ className: "badge" },
										"5"
									)
								)
							),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "#" },
									"Settings"
								)
							),
							React.createElement("li", { role: "separator", className: "divider" }),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "#" },
									"Logout ",
									React.createElement("i", { className: "icon-signout" })
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

	return Post;
})(Component);

module.exports = Post;