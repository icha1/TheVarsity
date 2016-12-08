import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux' 
import store from './stores/store'
import Main from './desktop/Main'
import { Account } from './desktop/containers'
import { Home, Detail } from './desktop/layout'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

const initialState = window.__PRELOADED_STATE__

const app = (
	<Provider store={ store.configureStore(initialState) }>
		<Router history={browserHistory}>
			<Route path="/" component={Main}>
				<IndexRoute component={Home}></IndexRoute>
				<Route path="/account" component={Account}></Route>
				<Route path="/:page/:slug" component={Detail}></Route>
			</Route>
		</Router>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))