var Milestone = require('../models/Milestone')
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

			Milestone.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, milestones){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(milestones)
					return
				}

				resolve(utils.Resource.convertToJson(milestones))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Milestone.findById(id, function(err, milestone){
				if (err){
					reject(err)
					return
				}

				resolve(milestone.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			Milestone.create(params, function(err, milestone){
				if (err){
					reject(err)
					return
				}

				resolve(milestone.summary())
			})	
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			Milestone.findByIdAndUpdate(id, params, {new:true}, function(err, milestone){
				if (err){
					reject(err)
					return
				}

				resolve(milestone.summary())
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			Milestone.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}
}

