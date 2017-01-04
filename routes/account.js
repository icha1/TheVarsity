var express = require('express')
var router = express.Router()
var ProfileController = require('../controllers/ProfileController')
var controllers = require('../controllers')
var bcrypt = require('bcryptjs')
var utils = require('../utils')

router.get('/:action', function(req, res, next){
	var action = req.params.action

	if (action == 'logout'){
		req.session.reset()
		res.json({
			confirmation: 'success'
		})
	}

	if (action == 'currentuser'){ // check if user logged in
		if (req.session == null){
			res.json({
				confirmation: 'fail',
				message: 'User not logged in'
			})

			return
		}

		if (req.session.token == null){
			res.json({
				confirmation: 'fail',
				message: 'User not logged in'
			})

			return
		}

		utils.JWT.verify(req.session.token, process.env.TOKEN_SECRET)
		.then(function(decode){
			var userId = decode.id
			return ProfileController.getById(userId)
		})
		.then(function(profile){
			res.json({
				confirmation: 'success',
				user: profile
			})
		})
		.catch(function(err){
			res.json({
				confirmation: 'fail',
				message: err.message || err
			})
		})
	}
})

router.post('/:action', function(req, res, next){
	var action = req.params.action

	var token = null
	var p = null

	if (action == 'register'){
		ProfileController
		.get({email: req.body.email})
		.then(function(profiles){
			return (profiles == 0) ? ProfileController.post(req.body) : profiles[0]
		})
		.then(function(profile){
			p = profile
			token = utils.JWT.sign({id:profile.id}, process.env.TOKEN_SECRET, {expiresIn:4000})
			req.session.token = token

			return utils.EmailUtils.sendEmail('info@thegridmedia.com', profile.email, 'The Varsity', 'Welcome to the Varsity')
		})
		.then(function(response){
			res.json({
				confirmation: 'success',
				user: p,
				token: token
			})

			return response
		})
		.catch(function(err){
			res.json({
				confirmation:'fail',
				message: err.message || err
			})
		})
	}

	if (action == 'login'){
		var email = req.body.email
		ProfileController
		.get({email:email}, true)
		.then(function(profiles){
			if (profiles.length == 0){
				res.json({
					confirmation:'fail',
					message:'Profile not found. Check spelling.'
				})

				return
			}

			var profile = profiles[0]
			var password = req.body.password

			// Check password
			var passwordCorrect = bcrypt.compareSync(password, profile.password)
			if (passwordCorrect == false){
				res.json({
					confirmation:'fail',
					message:'Incorrect Password'
				})

				return				
			}

			var token = utils.JWT.sign({id:profile._id}, process.env.TOKEN_SECRET, {expiresIn:4000})
			req.session.token = token
			res.json({
				confirmation: 'success',
				user: profile.summary(),
				token: token
			})
		})
		.catch(function(err){
			res.json({
				confirmation:'fail',
				message: err.message || err
			})

			return
		})
	}

	if (action == 'redeem'){ // redeem invitation
		var invitation = null
		var hostTeam = null

		controllers.invitation
		.get(req.body, true)
		.then(function(invitations){ // should return only one
			if (invitations.length == 0)
				throw new Error('Invitation Not Found. Check the email or invitation code.')
			
			invitation = invitations[0]
			return invitation
		})
		.then(function(invitation){
			return controllers.team.getById(invitation.team.id, true)
		})
		.then(function(team){
			hostTeam = team

			// create new profile, update team with new member:
			var profileParams = {
				password: invitation.code,
				email: invitation.email,
				username: invitation.name
			}

			return ProfileController.post(profileParams, true) // create new profile, return raw version
		})
		.then(function(profile){
//			console.log('TEST 4')
			var members = hostTeam.members
			members.push({
				id: profile.id,
				username: profile.username,
				image: profile.image
			})

			hostTeam['members'] = members
			hostTeam.markModified('members')

			var teamsArray = profile.teams
			teamsArray.push(hostTeam._id.toString())
			profile['teams'] = teamsArray
			profile.markModified('teams')

			var token = utils.JWT.sign({id:profile.id}, process.env.TOKEN_SECRET, {expiresIn:4000})
			req.session.token = token

			res.json({
				confirmation: 'success',
				team: hostTeam.summary(),
				user: profile.summary(),
				token: token
			})

			hostTeam.save()
			profile.save()
		})
		.catch(function(err){
			console.log('Account Router - Error: '+JSON.stringify(err))
			var msg = err.errmsg || err.message || err
			res.json({
				confirmation: 'fail',
				message: msg
			})
		})
	}

})

module.exports = router