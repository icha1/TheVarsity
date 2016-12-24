var Profile = require('../models/Profile')
var mongoose = require('mongoose')
var Promise = require('bluebird')
var bcrypt = require('bcryptjs')
var utils = require('../utils')

module.exports = {
	login: function(params, completion){
		Profile.find({email:params.email.toLowerCase()}, function(err, profiles) {
			if (err) {
				completion({message:err.message}, null)
				return
			}
			
			if (profiles.length == 0){
				completion({message:'Profile '+params.email+' not found.'}, null)
				return
			}
			
			var profile = profiles[0] // assume first one
			var isPasswordCorrect = bcrypt.compareSync(params.password, profile.password)
			if (isPasswordCorrect == false){
				completion({message:'Incorrect Password'}, null)
				return
			}

			// if (profile.password != params.password){
			// 	completion({'message':'Incorrect Password'}, null)
			// 	return
			// }
				
			completion(null, profile.summary())
			return
		})
	},

	checkCurrentUser: function(req){
		return new Promise(function(resolve, reject){
			if (req.session == null){
				resolve(null)
				return
			}

			if (req.session.token == null){
				resolve(null)
				return
			}

			utils.JWT.verify(req.session.token, process.env.TOKEN_SECRET)
			.then(function(decode){
				Profile.findById(decode.id, function(err, profile){
					if (err){
						req.session.reset()
						resolve(null)
						return
					}
					
					if (profile == null){
						req.session.reset()
						resolve(null)
						return
					}

					resolve(profile.summary())
				})
			})
			.catch(function(err){
				resolve(null)
			})
		})
	}, 

	currentUser: function(req){
	    return new Promise(function (resolve, reject){
			if (req.session == null){
				resolve(null)
				return
			}

			if (req.session.user == null){
				resolve(null)
				return
			}

			var userId = req.session.user
			Profile.findById(userId, function(err, profile){
				if (err){
					resolve(null)
					return
				}
				
				if (profile == null){
					resolve(null)
					return
				}

				resolve(profile.summary())
			})
	    })
	}

}

