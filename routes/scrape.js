var express = require('express')
var router = express.Router()
var controllers = require('../controllers')
var Request = require('../utils/Request')
var TextUtils = require('../utils/TextUtils')


router.get('/', function(req, res, next){

	var venueId = req.query.venue // id of venue
	if (venueId == null){
		res.json({
			confirmation: 'fail',
			message: 'missing venue parameter'
		})
		return
	}

	var venue = null
	var mostRecent = null
	var postInfo = {}

	controllers.venue
	.getById(venueId)
	.then(function(result){
		venue = result
		var instagram = venue.social.instagram
		var url = 'https://www.instagram.com/'+instagram+'/media/'
		return Request.get(url, null)
	})
	.then(function(results){
		var items = results.items
		mostRecent = items[0]
		return controllers.post.get({code: mostRecent.code}) // check if most recent post already exists
	})
	.then(function(posts){
		if (posts.length > 0){ // already exists
			var post = posts[0]
			return post
		}

		// create post:
		postInfo['title'] = venue.name
		postInfo['slug'] = TextUtils.slugVersion(venue.name)
		postInfo['geo'] = venue.geo
		postInfo['venue'] = {
			id: venue.id,
			name: venue.name,
			slug: venue.slug,
			image: venue.image,
			address: venue.address.street
		}

		postInfo['text'] = mostRecent.caption.text
		postInfo['code'] = mostRecent.code
		postInfo['timestamp'] = new Date(mostRecent['created_time']*1000)

		var images = mostRecent.images
		var standard_resolution = images['standard_resolution']['url']
		var image = standard_resolution.split('?')[0]
		postInfo['image'] = image.replace('e35/', 'e35/c150.150.600.600/')
		return controllers.post.post(postInfo)
	})
	.then(function(post){
		res.json(post)
		return
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

module.exports = router