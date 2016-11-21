var express = require('express')
var router = express.Router()
var controllers = require('../controllers')
var Request = require('../utils/Request')
var TextUtils = require('../utils/TextUtils')


router.get('/', function(req, res, next){

	var teamId = req.query.team // id of team
	if (teamId == null){
		res.json({
			confirmation: 'fail',
			message: 'missing team parameter'
		})
		return
	}

	var team = null
	var mostRecent = null
	var postInfo = {}

	controllers.team
	.getById(teamId)
	.then(function(result){
		team = result
		var instagram = team.social.instagram
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
		postInfo['title'] = team.name
		var slug = TextUtils.slugVersion(team.name)+'-'+TextUtils.randomString(8)
		console.log('SLUG == '+slug)
		postInfo['slug'] = slug
		postInfo['geo'] = team.geo
		postInfo['district'] = team.district
		postInfo['author'] = {
			id: team.id,
			profile: '',
			type: 'team',
			name: team.name,
			slug: team.slug,
			image: team.image,
			address: team.address.street
		}

		postInfo['text'] = mostRecent.caption.text
		postInfo['code'] = mostRecent.code
		postInfo['timestamp'] = new Date(mostRecent['created_time']*1000)
		postInfo['type'] = 'news'

		var images = mostRecent.images
		var standard_resolution = images['standard_resolution']['url']
		var image = standard_resolution.split('?')[0]
		postInfo['image'] = image.replace('e35/', 'e35/c150.150.600.600/') // this crops instagram images into squares
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