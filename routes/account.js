var express = require('express')
var router = express.Router()
var ProfileController = require('../controllers/ProfileController')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var EmailUtils = require('../utils/EmailUtils')

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

		if (req.session.user == null){
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
		// 	jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
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

		var userId = req.session.user
		ProfileController
		.getById(userId)
		.then(function(profile){
			res.json({
				confirmation: 'success',
				user: profile
			})
		})
		.catch(function(err){
			res.json({
				confirmation: 'fail',
				message: err
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
		.post(req.body)
		.then(function(profile){
			p = profile
			req.session.user = profile.id
			token = jwt.sign({id:profile.id}, process.env.SECRET_KEY, {expiresIn:4000})
			req.session.token = token

			return EmailUtils.sendEmail('info@thegridmedia.com', profile.email, 'The Varsity', 'Welcome to the Varsity')
		})
		.then(function(response){

			res.json({
				confirmation: 'success',
				user: p,
				token: token
			})

			return
		})
		.catch(function(err){
			res.json({
				confirmation:'fail',
				message: err
			})

			return
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
			var token = jwt.sign({id:profile.id}, process.env.SECRET_KEY, {expiresIn:4000})
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
				message: err
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