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
		},
		input: {
			color: "#333",
			fontWeight: 600,
			lineHeight: 1.5,
			fontSize: 30,
			fontFamily: "Pathway Gothic One",
			border: "none",
			width: 100 + "%",
			marginTop: 16
		},
		textarea: {
			border: "none",
			width: 100 + "%",
			minHeight: 100,
			resize: "none"
		},
		btnAdd: {
			float: "right",
			marginTop: 0,
			className: "button button-medium button-circle button-blue"
		},
		select: {
			marginBottom: 16,
			border: "1px solid #ddd",
			borderRadius: 0,
			boxShadow: "none"
		},
		admin: {
			background: "#fff",
			padding: 10,
			position: "fixed",
			bottom: 0,
			width: 44 + "%",
			minWidth: 320,
			border: "1px solid #ddd"
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