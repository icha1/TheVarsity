import React, { Component } from 'react'
import { Team } from '../containers'
import styles from './styles'

class Detail extends Component {
	componentDidMount(){
		console.log('componentDidMount: '+this.props.params.page)
		window.scrollTo(0, 0)
	}

	render(){
		let component = null
		switch (this.props.params.page) {
			case 'team':
				return component = <Team slug={this.props.params.slug} />

			case 'post':
				return component = <div>POST PAGE</div>

			default:
				return component = null
		}

		const style = styles.home
		return ( 
			{ component }
		)
	}
}

export default Detail
