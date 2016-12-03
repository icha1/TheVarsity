var express = require('express')
var router = express.Router()
var controllers = require('../controllers')

router.get('/:resource', function(req, res, next){
	var resource = req.params.resource

	var controller = controllers[resource]
	if (controller == null){
		res.json({
			confirmation:'fail',
			message: 'Invalid Resource'
		})
		return
	}

	// var token = req.headers['token']
	// if (token){
	// 	console.log('TOKEN == '+token)
	// 	jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
	// 		if (err){
	// 			// invalid token
	// 			return
	// 		}
	// 	})
	// }
	// else {
	// 	console.log('NO TOKEN')
	// }

	controller
	.get(req.query, false)
	.then(function(results){
		res.json({
			confirmation: 'success',
			results: results
		})

		return
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err
		})

		return
	})
})

router.get('/:resource/:id', function(req, res, next){
	var resource = req.params.resource
	var id = req.params.id

	var controller = controllers[resource]
	if (controller == null){
		res.json({
			confirmation:'fail',
			message: 'Invalid Resource.'
		})
		return
	}

	controller
	.getById(id)
	.then(function(result){
		res.json({
			confirmation: 'success',
			result: result
		})

		return
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: 'Not found'
		})

		return
	})
})

router.post('/:resource', function(req, res, next){
	var resource = req.params.resource

	var controller = controllers[resource]
	if (controller == null){
		res.json({
			confirmation:'fail',
			message: 'Invalid Resource.'
		})
		return
	}

	controller
	.post(req.body)
	.then(function(result){
		res.json({
			confirmation: 'success',
			result: result
		})

		return
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err
		})

		return
	})
})

router.put('/:resource/:id', function(req, res, next){
	var resource = req.params.resource
	var id = req.params.id

	var controller = controllers[resource]
	if (controller == null){
		res.json({
			confirmation:'fail',
			message: 'Invalid Resource.'
		})
		return
	}

	controller
	.put(id, req.body)
	.then(function(result){
		res.json({
			confirmation: 'success',
			result: result
		})

		return
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err
		})

		return
	})
})

router.delete('/:resource/:id', function(req, res, next){
	var resource = req.params.resource
	var id = req.params.id

	var controller = controllers[resource]
	if (controller == null){
		res.json({
			confirmation:'fail',
			message: 'Invalid Resource.'
		})
		return
	}

	controller
	.delete(id)
	.then(function(){
		res.json({
			confirmation: 'success'
		})
		return
	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err
		})

		return
	})

})

module.exports = router



