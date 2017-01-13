var Comment = require('../models/Comment')
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

			Comment.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, comments){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(comments)
					return
				}

				resolve(utils.Resource.convertToJson(comments))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Comment.findById(id, function(err, comment){
				if (err){
					reject(err)
					return
				}

				resolve(comment.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			Comment.create(params, function(err, comment){
				if (err){
					reject(err)
					return
				}

				resolve(comment.summary())
			})	
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			Comment.findByIdAndUpdate(id, params, {new:true}, function(err, comment){
				if (err){
					reject(err)
					return
				}

				resolve(comment.summary())
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			Comment.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}
}

