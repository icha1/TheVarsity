var express = require('express')
var router = express.Router()
var screenshot = require('url-to-image')

router.get('/', function(req, res, next){
	var url = req.query.url

	screenshot(url, 'public/images/file.png')
	.then(function() {

		res.json({
			confirmation: 'success',
			message: url+' screenshot saved to file.png'
		})

	})
	.catch(function(err){

		res.json({
			confirmation: 'fail',
			message: err
		})

	})

})

module.exports = router