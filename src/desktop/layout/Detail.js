import React, { Component } from 'react'
import { TeamDetail, PostDetail, ProfileDetail } from '../containers'
import styles from './styles'

class Detail extends Component {
	componentDidMount(){
//		console.log('componentDidMount: '+JSON.stringify(this.props.location))
		window.scrollTo(0, 0)
	}

	render(){
		let component = null
		const slug = this.props.params.slug
		const query = this.props.location.query
		switch (this.props.params.page) {
			case 'team':
				return component = <TeamDetail slug={slug} query={query} />

			case 'post':
				return component = <PostDetail slug={slug} query={query} />

			case 'profile':
				return component = <ProfileDetail slug={slug} query={query} />

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
