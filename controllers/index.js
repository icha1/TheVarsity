var PostController = require('../controllers/PostController')
var VenueController = require('../controllers/VenueController')
var DistrictController = require('../controllers/DistrictController')
var ProfileController = require('../controllers/ProfileController')

module.exports = {
	post: PostController,
	venue: VenueController,
	district: DistrictController,
	profile: ProfileController
}