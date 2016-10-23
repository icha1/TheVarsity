var express = require('express')
var router = express.Router()

var React = require('react')
var ReactRouter = require('react-router')
var ReactDOMServer = require('react-dom/server')

var ServerApp = require('../public/build/es5/serverapp')
var store = require('../public/build/es5/stores/store')
var Home = require('../public/build/es5/components/layout/Home')
var Detail = require('../public/build/es5/components/layout/Detail')
var controllers = require('../controllers')


matchRoutes = function(req, routes, initialStore){
	return new Promise(function(resolve, reject){
		ReactRouter.match({ routes, location: req.url }, function(error, redirectLocation, renderProps){
			if (error){
				reject(error)
				return
			}

			// if (redirectLocation){
			// 	return
			// }

			resolve(renderProps)
		})
	})
}

router.get('/', function(req, res, next) {
	var initialStore = null
	var reducers = {}
	var tags = {
		title: 'Home'
	}

	initialStore = store.configureStore(reducers)

	var routes = {
		path: '/',
		component: ServerApp,
		initial: initialStore,
		indexRoute: {
			component: Home
		}
	}

	matchRoutes(req, routes, initialStore)
	.then(function(renderProps){
		var html = ReactDOMServer.renderToString(React.createElement(ReactRouter.RouterContext, renderProps))
	    res.render('index', {
	    	react: html,
	    	tags: tags,
	    	preloadedState:JSON.stringify(initialStore.getState())
	    })
	})
	.catch(function(err){

	})
})


router.get('/:page', function(req, res, next) {
	var page = req.params.page
	if (page == 'scrape' || page == 'geo'){
		next()
		return
	}

    res.render(page, { title: page })
})

router.get('/:page/:slug', function(req, res, next) {
	var page = req.params.page
	var slug = req.params.slug
	
	if (page == 'api'){
		next()
		return
	}


	var initialStore = null
	var reducers = {}
	var tags = {}

	var controller = controllers[page]
	controller
	.get({slug:slug}, false)
	.then(function(results){
//		console.log('RESULTS: '+JSON.stringify(results))

		var map = {}
		results.forEach(function(entity){
			map[entity.slug] = entity
			tags['title'] = (entity.name == null) ? entity.title : entity.name
		})

		reducers[page] = {
			map: map,
			list: results
		}

		initialStore = store.configureStore(reducers)

		var routes = {
			path: '/:page/:slug',
			component: ServerApp,
			initial: initialStore,
			indexRoute: {
				component: Detail
			}
		}

		return matchRoutes(req, routes, initialStore)
	})
	.then(function(renderProps){
		var html = ReactDOMServer.renderToString(React.createElement(ReactRouter.RouterContext, renderProps))
	    res.render('index', {
	    	react: html,
	    	tags: tags,
	    	preloadedState:JSON.stringify(initialStore.getState())
	    })		
	})
	.catch(function(err){
	    res.render('error', err)
	})

})



module.exports = router