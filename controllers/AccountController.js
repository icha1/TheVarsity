var Profile = require('../models/Profile')
var mongoose = require('mongoose')
var Promise = require('bluebird')
var bcrypt = require('bcrypt')

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

	checkCurrentUser: function(req, completion){
		if (req.session == null){
			completion({message:'User not logged in.'}, null)
			return
		}

		if (req.session.user == null){
			completion({message:'User not logged in.'}, null)
			return
		}
		
		var userId = req.session.user
		Profile.findById(userId, function(err, profile){
			if (err){
				req.session.reset()
				completion({message:'Profile '+userId+' not found'}, null)
				return
			}
			
			if (profile == null){
				req.session.reset()
				completion({message:'Profile '+userId+' not found'}, null)
				return
			}

			completion(null, profile.summary())
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

