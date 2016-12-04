import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { ProfilePreview } from '../view'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import constants from '../../constants/constants'
import styles from './styles'
import { Link } from 'react-router'

class District extends Component {
	constructor(){
		super()
		this.state = {
			feedOptions: [
				{name: constants.FEED_TYPE_NEWS, display:'News'},
				{name: constants.FEED_TYPE_EVENT, display:'Events'},
				{name: constants.FEED_TYPE_TEAM, display:'Teams'},
				{name: constants.FEED_TYPE_CHAT, display:'Chat'}
			]
		}
	}

	selectFeed(event){
		event.preventDefault()
		window.scrollTo(0, 0)
		this.props.changeSelectedFeed(event.target.id)
	}

	render(){
		const style = styles.district
		const district = this.props.session.currentDistrict
		const selectedFeed = this.props.session.selectedFeed

		const list = this.state.feedOptions.map((feed, i) => {
			let selected = (selectedFeed == feed.name) ? style.selected : style.unselected
			return (
				<li key={i}>
					<div style={selected}>
						<a id={feed.name} onClick={this.selectFeed.bind(this)} href="#">{feed.display}</a>
					</div>
				</li>				
			)
		})

		const recentVisitors = district.recentVisitors
		const visitors = Object.keys(recentVisitors).map((id, i) => {
			const visitor = recentVisitors[id].visitor
			return <ProfilePreview key={visitor.id} profile={visitor} />
		})

		return (
			<div className="feature-box center media-box fbox-bg">
				<div className="fbox-desc">
					<div style={{minHeight:140}}>
						<div style={style.body}>
							<img style={{width:96,float:'right'}} src={district.image+'=s120-c'} />
							<span style={style.header}>{district.name}</span>
							<hr />
							<ul style={style.list}>
								{list}
							</ul>
						</div>
					</div>

					<div style={{borderTop:'1px solid #ddd', textAlign:'left'}}>
						{ visitors }
					</div>

				</div>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		session: state.session // currentDistrict, currentLocation, teams, selectedFeed, reload
	}
}

const dispatchToProps = (dispatch) => {
	return {
		changeSelectedFeed: (feed) => dispatch(actions.selectedFeedChanged(feed))		
	}
}

export default connect(stateToProps, dispatchToProps)(District)