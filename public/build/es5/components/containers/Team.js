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

var connect = require("react-redux").connect;
var APIManager = require("../../utils").APIManager;
var store = _interopRequire(require("../../stores/store"));

var actions = _interopRequire(require("../../actions/actions"));

var Map = require("../view").Map;
var Team = (function (Component) {
	function Team() {
		_classCallCheck(this, Team);

		_get(Object.getPrototypeOf(Team.prototype), "constructor", this).call(this);
		this.state = {};
	}

	_inherits(Team, Component);

	_prototypeProperties(Team, null, {
		componentDidMount: {
			value: function componentDidMount() {},
			writable: true,
			configurable: true
		},
		uploadImage: {
			value: function uploadImage(files) {
				var _this = this;
				console.log("uploadImage");
				APIManager.upload(files[0], function (err, image) {
					if (err) {
						alert(err);
						return;
					}

					// {"id":"fah0GA-4",
					// "address":"https://lh3.googleusercontent.com/BdHyl0Uzoq-MHbMLYx_n8IAKGrbRz2XhIdXBu3DjGd8rJLJRecVuBajNzOrhdI6BUe9njw3CqvthbzQQsHUjkupkMA",
					// "name":"apple.png",
					// "key":"AMIfv970_ybaBPO2Thty_bUCOyltTed9RWxww-2OYwQVeMtSLpbxxqH2ilWMiLvwODbCUSGgmASD02YIlkMKG7WYtqPcJqX58RyRigRchcOursW482o54uta75kkqFTxCwgpl9clcEhGTiMG-Qkf5pLZ_1GaXz4BWGKI4tlvM0cpCWhfah0GA-4"}			

					var team = _this.props.teams[_this.props.slug];
					var updated = Object.assign({}, team);
					updated.image = image.address;
					//			console.log(JSON.stringify(updated))

					var url = "/api/team/" + updated.id;
					APIManager.handlePut(url, updated, function (error, response) {
						console.log(JSON.stringify(response));
					});
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var team = this.props.teams[this.props.slug];
				var center = {
					lat: team.geo[0],
					lng: team.geo[1]
				};

				return React.createElement(
					"div",
					{ className: "clearfix" },
					React.createElement(
						"header",
						{ id: "header", className: "no-sticky" },
						React.createElement(
							"div",
							{ id: "header-wrap" },
							React.createElement(Map, { center: center, zoom: 17, animation: 2, markers: [team] })
						)
					),
					React.createElement(
						"section",
						{ id: "content", style: { background: "#f9f9f9", minHeight: 800 } },
						React.createElement(
							"div",
							{ className: "content-wrap container clearfix" },
							React.createElement(
								"div",
								{ className: "col_full col_last" },
								team.name,
								React.createElement("br", null),
								React.createElement(
									"a",
									{ href: "/scrape?team=" + team.id },
									"Scrape"
								),
								React.createElement("br", null),
								React.createElement("img", { src: team.image + "=s220" }),
								React.createElement("br", null),
								React.createElement("br", null),
								React.createElement(
									Dropzone,
									{ onDrop: this.uploadImage.bind(this) },
									"Upload Image Here",
									React.createElement("br", null)
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

	return Team;
})(Component);

var stateToProps = function (state) {
	return {
		teams: state.team.map
	};
};

module.exports = connect(stateToProps)(Team);