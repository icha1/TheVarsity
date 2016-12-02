var express = require('express')
var router = express.Router()
var ProfileController = require('../controllers/ProfileController')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

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

	if (action == 'register'){
		ProfileController
		.post(req.body)
		.then(function(profile){
			req.session.user = profile.id
			var token = jwt.sign(profile, process.env.SECRET_KEY, {expiresIn:4000})
			res.json({
				confirmation: 'success',
				user: profile,
				token: token
			})


			// res.json({
			// 	confirmation: 'success',
			// 	user: profile
			// })
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
			var token = jwt.sign(profile.summary(), process.env.SECRET_KEY, {expiresIn:4000})
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

})

module.exports = router