var express = require('express')
var router = express.Router()
var utils = require('../utils')

var React = require('react')
var ReactRouter = require('react-router')
var ReactDOMServer = require('react-dom/server')

var ServerApp = require('../public/build/es5/serverapp')
var store = require('../public/build/es5/stores/store')
var reducersIndex = require('../public/build/es5/reducers')

// desktop
var DesktopLayout = require('../public/build/es5/desktop/layout')
var Account = require('../public/build/es5/desktop/containers/Account') // should be in an account layout
var Feed = require('../public/build/es5/desktop/containers/Feed')

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
				console.log('REACT ROUTER ERROR: '+error)
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
//	var template = (isMobile(req)) ? 'index-mobile' : 'index'
	var template = 'index'
	var layout = (template == 'index') ? DesktopLayout : MobileLayout

	var initialStore = null
	var reducers = {}
	var tags = {
		title: 'Home',
		url: 'http://www.thevarsity.co',
		image: 'http://www.thevarsity.co/images/office-3.jpg',
		description: 'The Varsity is a collection of online communities organized into groups by skill: designers, photographers, software engineers, real estate etc. Users can tap into these groups when seeking collaborators for their next project, referrals, or employees.'
	}

	controllers.account
	.checkCurrentUser(req)
	.then(function(user){
		if (user != null){
			res.redirect('/feed') // if logged in, go right to feed page
			return
		}

		reducers['account'] = {currentUser: user, teams:[], notifications:[]} // can be null
		var session = {template: template}
		if (req.cookies.lastsearch) {
			var parts = req.cookies.lastsearch.split(',')
			var lat = parseFloat(parts[0])
			var lng = parseFloat(parts[1])
			session['currentLocation'] = {lat:lat, lng:lng}
		}
		reducers['session'] = reducersIndex.initial('session', session)
		
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
	if (page == 'scrape' || page == 'geo' || page == 'tags' || page == 'phantom' || page=='aws'){
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
		reducers['account'] = {currentUser: user, teams:[], notifications:[]} // can be null		
		initialStore = store.configureStore(reducers)
		var routes = {
			path: '/'+page,
			component: ServerApp,
			initial: initialStore,
			template: 'index', // todo: make this conditional upon user agent
			indexRoute: {
//				component: Account
				component: (page == 'account') ? Account : Feed
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

	var initialStore = null
	var reducers = {}
	var tags = {}

	controllers.account
	.checkCurrentUser(req)
	.then(function(user){
		reducers['account'] = {currentUser: user, teams:[], notifications:[]} // can be null
		var controller = controllers[page]
		return controller.get({slug:slug}, false)
	})
	.then(function(results){
		// console.log('RESULTS: '+JSON.stringify(results))
		results.forEach(function(entity, i){
			tags['url'] = process.env.BASE_URL+'/'+page+'/'+entity.slug
			tags['title'] = entity.title || entity.username || entity.name
			tags['image'] = (entity.image) ? entity.image+'=s260-c' : process.env.DEFAULT_TEAM_IMAGE
			var description = entity.description || entity.bio || ''
			tags['description'] = utils.TextUtils.truncateText(description, 200)
		})

		// var reducerKey = (page == 'project') ? 'post' : page // project is just a post anyway
		// reducers[reducerKey] = reducersIndex.initial(page, results)
		reducers[page] = reducersIndex.initial(page, results)
		initialStore = store.configureStore(reducers)

		var routes = {
			path: '/:page/:slug',
			component: ServerApp,
			template: 'index', // todo: make this conditional upon user agent
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