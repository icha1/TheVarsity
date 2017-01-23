import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { ProfilePreview } from '../view'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import constants from '../../constants/constants'
import styles from './styles'

class District extends Component {
	constructor(){
		super()
		this.state = {
			feedOptions: [
				{name: constants.FEED_TYPE_ALL, display:'Feed'},
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

	joinDistrict(event){
		event.preventDefault()
		const user = this.props.user
		if (user == null)
			return

		const district = this.props.session.currentDistrict
		let districts = user.districts
		if (districts.indexOf(district.id) != -1)
			return

		districts.push(district.id)
		this.props.updateProfile(user, {districts: districts})
	}

	leaveDistrict(event){
		event.preventDefault()
		const user = this.props.user
		if (user == null)
			return

		const district = this.props.session.currentDistrict
		let districts = user.districts
		const index = districts.indexOf(district.id)
		if (index == -1)
			return

		districts.splice(index, 1)
		this.props.updateProfile(user, {districts: districts})
	}

	render(){
		const style = styles.district
		const district = this.props.session.currentDistrict
		const selectedFeed = this.props.session.selectedFeed

		let btn = null
		if (this.props.user != null){
			if (this.props.user.districts.indexOf(district.id) == -1)			
				btn = <button onClick={this.joinDistrict.bind(this)} className="button button-border button-border-thin button-dirtygreen" style={{width:'100%'}}>Join District</button>
			else
				btn = <button onClick={this.leaveDistrict.bind(this)} className="button button-border button-border-thin button-dirtygreen" style={{width:'100%'}}>Leave District</button>
		}

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

		let districtImage = null
		if (district.id != null)
			districtImage = (district.image.length == 0) ? null : <img style={{maxWidth:96, float:'right'}} src={district.image+'=s120-c'} />

		return (
			<div className="feature-box center media-box fbox-bg" style={{marginTop:0, borderTop:'1px solid #ddd'}}>
				<div className="fbox-desc">
					<div style={{minHeight:140}}>
						<div style={style.body}>
							<span style={style.header}>{district.name} District</span>
							<hr />
							{ districtImage }
							<ul style={style.list}>
								{list}
							</ul>
							{ btn }

						</div>
					</div>

				</div>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		session: state.session // currentDistrict, currentLocation, teams, selectedFeed, reload
	}
}

const dispatchToProps = (dispatch) => {
	return {
		changeSelectedFeed: (feed) => dispatch(actions.selectedFeedChanged(feed)),
		updateProfile: (profile, params) => dispatch(actions.updateProfile(profile, params))
	}
}

export default connect(stateToProps, dispatchToProps)(District)