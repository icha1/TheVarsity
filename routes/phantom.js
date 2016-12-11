var express = require('express')
var router = express.Router()
var screenshot = require('url-to-image')
var superagent = require('superagent')
var path = require('path')
var sha1 = require('sha1')


router.get('/', function(req, res, next){
	var url = req.query.url

	if (url == null){
		res.json({
			confirmation: 'fail',
			message: 'Missing url parameter'
		})
		return
	}

	screenshot(url, 'public/images/file.png')
	.then(function() {
		// upload to cloudinary:

		var cloudinaryUrl = 'https://api.cloudinary.com/v1_1/'+process.env.CLOUDINARY_CLOUD_NAME+'/image/upload'
        var uploadRequest = superagent.post(cloudinaryUrl)

		var filepath = path.join(__dirname, 'public', 'images/file.png').replace('routes/', '')
        uploadRequest.attach('file', filepath)

		var timestamp = Date.now() / 1000
		var paramsStr = 'timestamp='+timestamp+'&upload_preset='+process.env.CLOUDINARY_UPLOAD_PRESET+process.env.CLOUDINARY_SECRET

	    uploadRequest.field('timestamp', timestamp)
	    uploadRequest.field('api_key', process.env.CLOUDINARY_API_KEY)
	    uploadRequest.field('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET)
	    uploadRequest.field('signature', sha1(paramsStr))

        uploadRequest.end((err, resp) => {
        	if (err){
		      	console.log('UPLOAD ERROR: '+JSON.stringify(err))
				res.json({
					confirmation: 'fail',
					message: err
				})
              	return
        	}

	      	var image = resp.body.image
			console.log('DONE == '+JSON.stringify(resp.body))

			res.json({
				confirmation: 'success',
				image: resp.body
			})
        })
	})
	.catch(function(error){
		res.json({
			confirmation: 'fail',
			message: error
		})
	})
})

module.exports = router