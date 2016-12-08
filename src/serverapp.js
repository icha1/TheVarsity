import React, { Component } from 'react'
import Main from './desktop/Main'
import { Provider } from 'react-redux'


class ServerApp extends Component {

	render(){
		return (			
			<Provider store={this.props.route.initial}>
				<Main {...this.props} />
			</Provider>
		)
	}
}

export default ServerApp