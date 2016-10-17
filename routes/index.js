var express = require('express')
var router = express.Router()

var React = require('react')
var ReactRouter = require('react-router')
var ReactDOMServer = require('react-dom/server')

var ServerApp = require('../public/build/es5/serverapp')
var store = require('../public/build/es5/stores/store')
var Home = require('../public/build/es5/components/layout/Home')
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
	var tags = {}


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
	if (page == 'scrape'){
		next()
		return
	}
	
    res.render(page, { title: 'Express' })
})



module.exports = router