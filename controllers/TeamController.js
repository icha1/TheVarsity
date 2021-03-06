var Team = require('../models/Team')
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

			Team.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, teams){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(teams)
					return
				}

				resolve(utils.Resource.convertToJson(teams))
			})
		})
	},

	getById: function(id, isRaw, token){
		return new Promise(function(resolve, reject){
			Team.findById(id, function(err, team){
				if (err){
					reject(err)
					return
				}

				if(isRaw)
					resolve(team)

				resolve(team.summary())
			})
		})
	},

	// post: function(params){
	// 	return new Promise(function(resolve, reject){
	// 		if (params.slug == null) // might already be assigned
	// 			params['slug'] = utils.TextUtils.slugVersion(params.name)+'-'+utils.TextUtils.randomString(8)

	// 		var address = params.address
	// 	    var url = 'https://maps.googleapis.com/maps/api/geocode/json'
	// 	    var query = address.street+','+address.city+','+address.state
	// 	    var mapsQuery = {
	// 	    	address: query,
	// 	    	key:process.env.GOOGLE_MAPS_API_KEY
	// 	    }

	// 	    utils.Request.get(url, mapsQuery)
	// 	    .then(function(response){
	// 	    	var results = response.results
	// 	    	var locationInfo = results[0]
	// 	    	var geometry = locationInfo.geometry
	// 	    	var location = geometry.location
	// 	    	var geo = [location.lat, location.lng]
	// 	    	params['geo'] = geo

	// 	    	var address_components = locationInfo['address_components'] // this is an array
	// 	    	if (address_components != null){ // find zip code...

	// 	    		var zip = ''
	// 		    	for (var i=0; i<address_components.length; i++){
	// 		    		var component = address_components[i]
	// 		    		var types = component['types'] // this is an array
	// 		    		if (types == null)
	// 		    			continue

	// 		    		var value = component['long_name']
	// 		    		if (value == null)
	// 		    			continue

	// 		    		if (types.indexOf('postal_code') != -1)
	// 				    	zip = value.toLowerCase()
	// 		    	}

	// 			    params['zip'] = zip
	// 	    	}

	// 			Team.create(params, function(err, team){
	// 				if (err){
	// 					reject(err)
	// 					return
	// 				}

	// 				resolve(team.summary())
	// 			})
	// 	    })
	// 	    .catch(function(err){
	// 	    	console.log('ERROR: '+err)
	// 	    	reject(err)
	// 			return
	// 	    })
	// 	})
	// },

	post: function(params){
		return new Promise(function(resolve, reject){
			if (params.slug == null) // might already be assigned
				params['slug'] = utils.TextUtils.slugVersion(params.name)+'-'+utils.TextUtils.randomString(8)

			Team.create(params, function(err, team){
				if (err){
					reject(err)
					return
				}

				resolve(team.summary())
			})
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			Team.findByIdAndUpdate(id, params, {new:true}, function(err, team){
				if (err){
					reject(err)
					return
				}

				resolve(team.summary())
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			Team.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}
}

