import React, { Component } from 'react'
import Main from './desktop/Main'
import MobileMain from './mobile/MobileMain'
import { Provider } from 'react-redux'


class ServerApp extends Component {

	componentWillMount(){
		console.log('ServerApp: componentWillMount - '+JSON.stringify(this.props.route))
		console.log('Template = '+this.props.route.template)

	}

	render(){
		const template = this.props.route.template
		
		// TODO: determine which main component base on template
		const main = <Main {...this.props} />

		return (
			<Provider store={this.props.route.initial}>
				{ main }
			</Provider>
		)
	}
}

export default ServerApp