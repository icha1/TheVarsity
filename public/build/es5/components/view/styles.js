"use strict";

module.exports = {

	post: {
		container: {
			background: "#fff",
			className: "comment-wrap clearfix"
		},
		content: {
			textAlign: "left",
			className: "comment-content clearfix"
		},
		header: {
			marginBottom: 0
		},
		title: {
			color: "#333",
			fontFamily: "Pathway Gothic One"
		},
		postImage: {
			maxWidth: 180,
			marginTop: 12
		}
	},
	nav: {
		ul: {
			fontWeight: 100
		},
		title: {
			color: "#fff"
		}
	},
	loader: {
		lines: 13,
		length: 20,
		width: 10,
		radius: 30,
		corners: 1,
		rotate: 0,
		direction: 1,
		color: "#fff",
		speed: 1,
		trail: 60,
		shadow: false,
		hwaccel: false,
		zIndex: 2000000000,
		top: "50%",
		left: "50%",
		scale: 1
	}

};