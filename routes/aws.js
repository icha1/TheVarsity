var express = require('express')
var router = express.Router()
var controllers = require('../controllers')
var Request = require('../utils/Request')
var TextUtils = require('../utils/TextUtils')
var utils = require('../utils')


router.get('/', function(req, res, next){

	res.json({
		confirmation:'success',
		apikey: process.env.AWS_ACCESS_KEY_ID,
		secret: process.env.AWS_SECRET_ACCESS_KEY
	})
})

module.exports = router