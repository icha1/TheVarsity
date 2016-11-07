var express = require('express')
var router = express.Router()
var controllers = require('../controllers')
var Request = require('../utils/Request')
var TextUtils = require('../utils/TextUtils')
var cheerio = require('cheerio')
var superagent = require('superagent')

router.get('/', function(req, res, next){

	var url = req.query.url // url to scrape
	superagent
	.get(url)
	.query(null)
	.set('Accept', 'text/html')
	.end(function(err, response){
		if (err){
			return
		}

		var props = ['og:title', 'og:description', 'og:image']
		var metaData = {}
		$ = cheerio.load(response.text)
	    $('meta').each(function(i, meta) {
	    	if (meta.attribs != null){
	    		var attribs = meta.attribs
		    	if (attribs.property != null){
			    	var prop = attribs.property
			    	if (props.indexOf(prop) != -1){
						var key = prop.replace('og:', '')
				    	metaData[key] = attribs.content
			    	}
		    	}
	    	}
	    })

	    console.log(JSON.stringify(metaData))
	    res.json(metaData)
	})

})

module.exports = router