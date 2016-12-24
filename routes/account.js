var express = require('express')
var router = express.Router()
var ProfileController = require('../controllers/ProfileController')
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

//		var token = req.headers['token']
		// var token = req.session.token
		// if (token){
		// 	// console.log('TOKEN == '+token)
		// 	jwt.verify(token, process.env.TOKEN_SECRET, function(err, decode){
		// 		if (err){
		// 			// invalid token
		// 			console.log('INVALID TOKEN')
		// 			return
		// 		}

		// 		console.log('VALID TOKEN: '+JSON.stringify(decode))
		// 	})
		// }
		// else {
		// 	console.log('NO TOKEN')
		// }

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
			req.session.user = profile.id
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

			req.session.user = profile._id
			var token = utils.JWT.sign({id:profile.id}, process.env.TOKEN_SECRET, {expiresIn:4000})
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

	if (action == 'invite'){
		var invited = req.body.invited
		res.json({
			confirmation: 'success',
			invited: invited
		})

	}

})

module.exports = router