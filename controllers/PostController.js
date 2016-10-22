var Post = require('../models/Post')
var Resource = require('../utils/Resource')
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

				resolve(Resource.convertToJson(posts))
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
			Post.create(params, function(err, post){
				if (err){
					reject(err)
					return
				}

				resolve(post.summary())
			})
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			Post.findByIdAndUpdate(id, params, {new:true}, function(err, post){
				if (err){
					reject(err)
					return
				}

				resolve(post.summary())
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

