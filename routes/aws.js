var express = require('express')
var router = express.Router()
var controllers = require('../controllers')
var Request = require('../utils/Request')
var TextUtils = require('../utils/TextUtils')
var utils = require('../utils')
var aws = require('aws-sdk')


router.get('/', function(req, res, next){

	var filename = req.query.filename
	if (filename == null){
		res.json({
			confirmation:'fail',
			message: 'Missing filename.'

		})
		return
	}

	var filetype = req.query.filetype
	if (filetype == null){
		res.json({
			confirmation:'fail',
			message: 'Missing filetype.'

		})
		return
	}

	var s3 = new aws.S3()
	const s3Params = {
	    Bucket: 'thevarsity',
	    Key: filename,
	    Expires: 3600,
	    ContentType: filetype,
	    ACL: 'public-read'
	}

	s3.getSignedUrl('putObject', s3Params, function(err, data) {
	    if (err){
		    console.log('S3 ERROR: '+err)
		    return
	    }

	    // var returnData = {
	    //   signedRequest: data,
	    //   url: 'https://thevarsity.s3.amazonaws.com/'+file.name
	    // }

		res.json({
			confirmation: 'success',
		    signedRequest: data,
		    url: 'https://thevarsity.s3.amazonaws.com/'+filename
		})
	})


})

module.exports = router