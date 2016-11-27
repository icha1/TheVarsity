var District = require('../models/District')
var Request = require('../utils/Request')
var Resource = require('../utils/Resource')
var TextUtils = require('../utils/TextUtils')
var Promise = require('bluebird')

module.exports = {
	get: function(params, isRaw){
		return new Promise(function(resolve, reject){
			if (params.lat!=null && params.lng!=null){
				var range = (params.range == null) ? 50 : parseInt(params.range)
				var distance = range/6371 // 6371 is radius of earth in KM
//				var distance = 50/6371 // 6371 is radius of earth in KM

				params['geo'] = {
				  	$near: [params.lat, params.lng],
			  		$maxDistance: distance
				}

				delete params['lat']
				delete params['lng']
				delete params['range']
			}

			/* Query by filters passed into parameter string: */
			var limit = params.limit
			if (limit == null)
				limit = '0'
			
			delete params['limit']

			District.find(params, null, {limit: parseInt(limit)}, function(err, districts){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(districts)
					return
				}

				resolve(Resource.convertToJson(districts))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			District.findById(id, function(err, district){
				if (err){
					reject(err)
					return
				}

				resolve(district.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			params['slug'] = TextUtils.slugVersion(params.name)
			params['zips'] = params.zipCodes.split(',')

			var geoParts = params.latlng.split(',')
			params['geo'] = [
				parseFloat(geoParts[0]),
				parseFloat(geoParts[1])			
			]

			District.create(params, function(err, district){
				if (err){
					reject(err)
					return
				}

				resolve(district.summary())
			})
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			District.findByIdAndUpdate(id, params, {new:true}, function(err, district){
				if (err){
					reject(err)
					return
				}

				resolve(district.summary())
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			District.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}

}

