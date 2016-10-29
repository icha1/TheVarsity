import React, { Component } from 'react'
import { Team } from '../containers'
import styles from './styles'

class Detail extends Component {
	componentDidMount(){
		console.log('componentDidMount: '+this.props.params.slug)
		window.scrollTo(0, 0)
	}

	render(){
		const style = styles.home
		return ( 
			<Team slug={this.props.params.slug} />
		)
	}
}

export default Detail
