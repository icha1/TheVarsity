import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Map } from '../view'

class TeamDetail extends Component {

	render(){
		const team = this.props.teams[this.props.slug]
		const center = {
			lat: team.geo[0],
			lng: team.geo[1]
		}

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<Map center={center} zoom={17} animation={2} markers={[team]} />
		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">

						<div className="col_full col_last">
							{ team.name }
							<br />
							<a href={'/scrape?team='+team.id}>Scrape</a>
							<br />
							<img src={team.image+'=s220'} />

						</div>
					</div>
				</section>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		teams: state.team.map
	}
}

export default connect(stateToProps)(TeamDetail)
