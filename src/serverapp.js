import React, { Component } from 'react'
import Main from './desktop/Main'
import MobileMain from './mobile/MobileMain'
import { Provider } from 'react-redux'


class ServerApp extends Component {

	componentWillMount(){
		// console.log('ServerApp: componentWillMount - '+JSON.stringify(this.props.route))
		// console.log('Template = '+this.props.route.template)

	}

	render(){
		const template = this.props.route.template
		const main = (template == 'index') ? <Main {...this.props} /> : <MobileMain {...this.props} /> // index or index-mobile
		
		return (
			<Provider store={this.props.route.initial}>
				{ main }
			</Provider>
		)
	}
}

export default ServerApp