var PostController = require('../controllers/PostController')
var VenueController = require('../controllers/VenueController')
var DistrictController = require('../controllers/DistrictController')
var ProfileController = require('../controllers/ProfileController')
var AccountController = require('../controllers/AccountController')

module.exports = {
	post: PostController,
	venue: VenueController,
	district: DistrictController,
	profile: ProfileController,
	account: AccountController
}