import React, { Component } from 'react'
import { Venues } from '../containers'
import styles from './styles'

class Venue extends Component {
	componentDidMount(){
		console.log('componentDidMount: '+this.props.params.slug)
		window.scrollTo(0, 0)

	}

	render(){
		const style = styles.home
		return ( 
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<Venues />
		            </div>
				</header>

				<section id="content" style={style.content}>
					<div className="content-wrap container clearfix">

						<div className="col_full col_last">
							Venue Page

						</div>
					</div>

				</section>
			</div>
		)
	}
}

export default Venue
