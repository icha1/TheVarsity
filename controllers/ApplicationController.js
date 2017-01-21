var Application = require('../models/Application')
var utils = require('../utils')
var Promise = require('bluebird')

module.exports = {
	get: function(params, isRaw){
		return new Promise(function(resolve, reject){
			var sortOrder = (params.sort == 'asc') ? 1 : -1
			delete params['sort']

			/* Query by filters passed into parameter string: */
			var limit = params.limit
			if (limit == null)
				limit = '0'
			
			delete params['limit']

			Application.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, applications){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(applications)
					return
				}

				resolve(utils.Resource.convertToJson(applications))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Application.findById(id, function(err, application){
				if (err){
					reject(err)
					return
				}

				resolve(application.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			if (params.slug == null) // might already be assigned
				params['slug'] = utils.TextUtils.randomString(6)

			Application.create(params, function(err, application){
				if (err){
					reject(err)
					return
				}

				resolve(application.summary())
			})
		})
	},

	put: function(id, params, token){
		return new Promise(function(resolve, reject){
			if (token == null){
				reject({message: 'Unauthorized'})
				return
			}

			utils.JWT.verify(token, process.env.TOKEN_SECRET)
			.then(function(decode){
				var userId = decode.id
				console.log('USER ID: '+userId)
				// TODO: check if user is authorized to change Application

				Application.findByIdAndUpdate(id, params, {new:true}, function(err, application){
					if (err){
						reject(err)
						return
					}

					resolve(application.summary())
				})
			})
			.catch(function(err){
				reject(err)
				return
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			Application.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}

}

