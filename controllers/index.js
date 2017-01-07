var PostController = require('../controllers/PostController')
var DistrictController = require('../controllers/DistrictController')
var ProfileController = require('../controllers/ProfileController')
var AccountController = require('../controllers/AccountController')
var TeamController = require('../controllers/TeamController')
var InvitationController = require('../controllers/InvitationController')
var FeedbackController = require('../controllers/FeedbackController')

module.exports = {
	post: PostController,
	district: DistrictController,
	profile: ProfileController,
	account: AccountController,
	team: TeamController,
	invitation: InvitationController,
	feedback: FeedbackController
}