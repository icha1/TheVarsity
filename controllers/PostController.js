var Post = require('../models/Post')
var utils = require('../utils')
var Promise = require('bluebird')

module.exports = {
	get: function(params, isRaw){
		return new Promise(function(resolve, reject){
			var sortOrder = (params.sort == 'asc') ? 1 : -1
			delete params['sort']


			if (params.lat!=null && params.lng!=null){
				var distance = 1000/6371 // 6371 is radius of earth in KM
				params['geo'] = {
				  	$near: [params.lat, params.lng],
			  		$maxDistance: distance
				}

				delete params['lat']
				delete params['lng']
			}

			/* Query by filters passed into parameter string: */
			var limit = params.limit
			if (limit == null)
				limit = '0'
			
			delete params['limit']
			
			Post.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, posts){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(posts)
					return
				}

				resolve(utils.Resource.convertToJson(posts))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Post.findById(id, function(err, post){
				if (err){
					reject(err)
					return
				}

				resolve(post.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			if (params.slug == null) // might already be assigned
				params['slug'] = utils.TextUtils.slugVersion(params.title) + TextUtils.randomString(6)

			Post.create(params, function(err, post){
				if (err){
					reject(err)
					return
				}

				resolve(post.summary())
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
				// TODO: check if user is authorized to change post

				Post.findByIdAndUpdate(id, params, {new:true}, function(err, post){
					if (err){
						reject(err)
						return
					}

					resolve(post.summary())
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
			Post.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}

}

