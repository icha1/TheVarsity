var Profile = require('../models/Profile')
var TextUtils = require('../utils/TextUtils')
var Promise = require('bluebird')
var bcrypt = require('bcryptjs')

module.exports = {
	get: function(params, isRaw){
		return new Promise(function(resolve, reject){
			var sortOrder = (params.sort == 'asc') ? 1 : -1
			delete params['sort']
			
			Profile.find(params, null, {sort:{timestamp: sortOrder}}, function(err, profiles){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(profiles)
					return
				}

				var list = []
				for (var i=0; i<profiles.length; i++){
					var profile = profiles[i]
					list.push(profile.summary())
				}

				resolve(list)
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Profile.findById(id, function(err, profile){
				if (err){
					reject(err)
					return
				}

				resolve(profile.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			Profile.find({email: params.email}, function(err, profiles){
				if (err){
					reject(err)
					return
				}

				if (profiles.length > 0){ // profile already exisits
					var profile = profiles[0]
					resolve(profile.summary())
					return
				}

				else { // this is what should happen:
					if (params.password != null)
						params['password'] = bcrypt.hashSync(params.password, 10)

					if (params.username != null)
						params['slug'] = TextUtils.slugVersion(params.username) + TextUtils.randomString(6)

					Profile.create(params, function(error, profile){
						if (error){
							reject(error)
							return
						}

						resolve(profile.summary())
					})
				}
			})
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			if (params.password != null)
				params['password'] = bcrypt.hashSync(params.password, 10)

			if (params.username != null)
				params['slug'] = TextUtils.slugVersion(params.username)
						
			Profile.findByIdAndUpdate(id, params, {new:true}, function(err, profile){
				if (err){
					reject(err)
					return
				}

				resolve(profile.summary())
			})
		})
	}

}