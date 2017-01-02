var Invitation = require('../models/Invitation')
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

			Invitation.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, invitations){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(invitations)
					return
				}

				resolve(utils.Resource.convertToJson(invitations))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Invitation.findById(id, function(err, invitation){
				if (err){
					reject(err)
					return
				}

				resolve(invitation.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			Invitation.create(params, function(err, invitation){
				if (err){
					reject(err)
					return
				}

				resolve(invitation.summary())
			})	
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			Invitation.findByIdAndUpdate(id, params, {new:true}, function(err, invitation){
				if (err){
					reject(err)
					return
				}

				resolve(invitation.summary())
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			Invitation.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}
}

