var PostController = require('../controllers/PostController')
var DistrictController = require('../controllers/DistrictController')
var ProfileController = require('../controllers/ProfileController')
var AccountController = require('../controllers/AccountController')
var TeamController = require('../controllers/TeamController')
var InvitationController = require('../controllers/InvitationController')

module.exports = {
	post: PostController,
	district: DistrictController,
	profile: ProfileController,
	account: AccountController,
	team: TeamController,
	invitation: InvitationController
}