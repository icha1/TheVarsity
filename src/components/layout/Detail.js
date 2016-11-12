import React, { Component } from 'react'
import { TeamDetail, PostDetail, ProfileDetail } from '../containers'
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
				return component = <TeamDetail slug={this.props.params.slug} />

			case 'post':
				return component = <PostDetail slug={this.props.params.slug} />

			case 'profile':
				return component = <ProfileDetail slug={this.props.params.slug} />

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
