var express = require('express')
var router = express.Router()

var React = require('react')
var ReactRouter = require('react-router')
var ReactDOMServer = require('react-dom/server')

var ServerApp = require('../public/build/es5/serverapp')
var store = require('../public/build/es5/stores/store')
var reducersIndex = require('../public/build/es5/reducers')

// desktop
var DesktopLayout = require('../public/build/es5/desktop/layout')
var Account = require('../public/build/es5/desktop/containers/Account') // should be in an account layout

// Mobile
var MobileLayout = require('../public/build/es5/mobile/layout')

var controllers = require('../controllers')
var staticPages = {
	create: 'create',
	authenticate: 'authenticate'
}

isMobile = function (req){
	// Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1
	var userAgent = req.headers['user-agent'].toLowerCase()
	var parts = userAgent.split(' ')
//	console.log('USER AGENT: '+userAgent)
	return (parts.indexOf('iphone') >= 0)	
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
	var template = (isMobile(req)) ? 'index-mobile' : 'index'
	var layout = (template == 'index') ? DesktopLayout : MobileLayout

	var initialStore = null
	var reducers = {}
	var tags = {title: 'Home'}

	controllers.account
	.checkCurrentUser(req)
	.then(function(user){
		reducers['account'] = {currentUser: user, teams:[]} // can be null
		if (req.cookies.lastsearch) {
			var parts = req.cookies.lastsearch.split(',')
			var lat = parseFloat(parts[0])
			var lng = parseFloat(parts[1])

			reducers['session'] = reducersIndex.initial('session', {currentLocation:{lat:lat, lng:lng}, template:template})
		}
		
		initialStore = store.configureStore(reducers)
		var routes = {
			path: '/',
			component: ServerApp,
			initial: initialStore,
			template: template,
			indexRoute: {
				component: layout.Home
			}
		}

		return matchRoutes(req, routes, initialStore)
	})
	.then(function(renderProps){
		var html = ReactDOMServer.renderToString(React.createElement(ReactRouter.RouterContext, renderProps))
	    res.render(template, {
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
				component: DesktopLayout.Detail
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