var express = require('express')
var router = express.Router()
var Request = require('../utils/Request')


router.get('/', function(req, res, next){
	var lat = req.query.lat
	if (lat == null){
		res.json({
			confirmation: 'fail',
			message: 'Missing lat parameter'
		})

		return
	}

	var lng = req.query.lng
	if (lng == null){
		res.json({
			confirmation: 'fail',
			message: 'Missing lng parameter'
		})

		return
	}

	var latLng = lat+','+lng
	var url = 'https://maps.googleapis.com/maps/api/geocode/json'
	var params = {
		latlng: latLng,
		key: process.env.GOOGLE_MAPS_API_KEY
	}

	Request.get(url, params)
	.then(function(response){
		res.json({
			confirmation:'success',
			results: response.results
		})
		return
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err
		})
	})

})


module.exports = router