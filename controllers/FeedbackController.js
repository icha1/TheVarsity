var Feedback = require('../models/Feedback')
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

			Feedback.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, feedbacks){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(feedbacks)
					return
				}

				resolve(utils.Resource.convertToJson(feedbacks))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Feedback.findById(id, function(err, feedback){
				if (err){
					reject(err)
					return
				}

				resolve(feedback.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			Feedback.create(params, function(err, feedback){
				if (err){
					reject(err)
					return
				}

				resolve(feedback.summary())
			})	
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			Feedback.findByIdAndUpdate(id, params, {new:true}, function(err, feedback){
				if (err){
					reject(err)
					return
				}

				resolve(feedback.summary())
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			Feedback.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}
}

