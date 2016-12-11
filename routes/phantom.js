var express = require('express')
var router = express.Router()
var screenshot = require('url-to-image')

router.get('/', function(req, res, next){

	screenshot('https://empowerchangenyc.com/', 'public/images/empowerchangenyc.png')
	.done(function() {

		res.json({
			confirmation: 'success',
			message: 'https://empowerchangenyc.com/ screenshot saved to empowerchangenyc.png'
		})

	})

})

module.exports = router