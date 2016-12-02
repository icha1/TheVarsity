var express = require('express')
var router = express.Router()

var React = require('react')
var ReactRouter = require('react-router')
var ReactDOMServer = require('react-dom/server')

var ServerApp = require('../public/build/es5/serverapp')
var store = require('../public/build/es5/stores/store')
var Home = require('../public/build/es5/components/layout/Home')
var Account = require('../public/build/es5/components/layout/Account')
var Detail = require('../public/build/es5/components/layout/Detail')
var reducersIndex = require('../public/build/es5/reducers')
var controllers = require('../controllers')

var staticPages = {
	create: 'create',
	authenticate: 'authenticate'
}

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
	var tags = {title: 'Home'}

	controllers.account
	.checkCurrentUser(req)
	.then(function(user){
		reducers['account'] = {currentUser: user, teams:[]} // can be null
		
		initialStore = store.configureStore(reducers)
		var routes = {
			path: '/',
			component: ServerApp,
			initial: initialStore,
			indexRoute: {
				component: Home // temporary
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

	})
})


router.get('/:page', function(req, res, next) {
	var page = req.params.page
	if (page == 'scrape' || page == 'geo' || page == 'tags'){
		next()
		return
	}

	var staticPage = staticPages[page]
	if (staticPage != null){
		res.render(staticPage, null)
		return
	}

	var initialStore = null
	var reducers = {}
	var tags = {title: page}

	controllers.account
	.checkCurrentUser(req)
	.then(function(user){
		reducers['account'] = {currentUser: user, teams:[]} // can be null		
		initialStore = store.configureStore(reducers)
		var routes = {
			path: '/'+page,
			component: ServerApp,
			initial: initialStore,
			indexRoute: {
				component: Account // temporary
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

router.get('/:page/:slug', function(req, res, next) {
	var page = req.params.page
	var slug = req.params.slug
	
	if (page == 'api' || page == 'account'){
		next()
		return
	}

	// console.log('PAGE == '+page)
	// console.log('SLUG == '+slug)

	var initialStore = null
	var reducers = {}
	var tags = {}

	controllers.account
	.checkCurrentUser(req)
	.then(function(user){
		reducers['account'] = {currentUser: user, teams:[]} // can be null
		var controller = controllers[page]
		return controller.get({slug:slug}, false)
	})
	.then(function(results){
		// console.log('RESULTS: '+JSON.stringify(results))
		results.forEach(function(entity){
			tags['title'] = entity.title || entity.username || entity.name
		})

		reducers[page] = reducersIndex.initial(page, results)
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