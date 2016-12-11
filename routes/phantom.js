var express = require('express')
var router = express.Router()
var screenshot = require('url-to-image')
var superagent = require('superagent')
var path = require('path')

router.get('/', function(req, res, next){
	var url = req.query.url

	screenshot(url, 'public/images/file.png')
	.then(function() {

		// res.json({
		// 	confirmation: 'success',
		// 	message: url+' screenshot saved to file.png'
		// })

		superagent
		.get('https://media-service.appspot.com/api/upload')
		.query(null)
		.set('Accept', 'application/json')
		.end((err, response) => {
			if (err){ 
				res.json({
					confirmation: 'fail',
					message: err
				})
				return
			}

			if (response.body.confirmation != 'success'){
				res.json({
					confirmation: 'fail',
					message: response.body.message
				})
	    		// completion({message:res.body.message}, null)
	    		return
			}

	        var uploadRequest = superagent.post(response.body.upload)
//	        uploadRequest.attach('file', file)

			var filepath = path.join(__dirname, 'public', 'images/file.png').replace('routes/', '')
			console.log('PATH == '+filepath)
	        uploadRequest.attach('file', filepath)
	        uploadRequest.end((err, resp) => {
	        	if (err){
					res.json({
						confirmation: 'fail',
						message: err
					})


			      	console.log('UPLOAD ERROR: '+JSON.stringify(err))
//					completion(err, null)
	              	return
	        	}


		      	var image = resp.body.image
				console.log('DONE == '+JSON.stringify(resp.body))

				res.json({
					confirmation: 'success',
					image: image
				})

//				completion(null, image)
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