import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux' 
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import store from './stores/store'

// Desktop
import Main from './desktop/Main'
import { Account } from './desktop/containers'
import { Home, Detail } from './desktop/layout'

// Mobile
import MobileMain from './mobile/MobileMain'
import MobileLayout from './mobile/layout'

const initialState = window.__PRELOADED_STATE__

class App extends Component {
	render (){
//		console.log('APP: Render - '+initialState.session.template)
		let app = null
		if (initialState.session.template == 'index'){ // desktop version
			app = (
				<Route path="/" component={Main}>
					<IndexRoute component={Home}></IndexRoute>
					<Route path="/account" component={Account}></Route>
					<Route path="/:page/:slug" component={Detail}></Route>
				</Route>
			)
		}
		else { // mobile version
			app = (
				<Route path="/" component={ MobileMain}>
					<IndexRoute component={ MobileLayout.Home }></IndexRoute>
				</Route>
			)
		}

		return (
			<Provider store={ store.configureStore(initialState) }>
				<Router history={browserHistory}>
					{ app}
				</Router>
			</Provider>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('root'))