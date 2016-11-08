import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { APIManager } from '../../utils'
import actions from '../../actions/actions'
import constants from '../../constants/constants'
import styles from './styles'

class District extends Component {
	selectFeed(event){
		event.preventDefault()
		this.props.changeSelectedFeed(event.target.id)
	}

	render(){
		const style = styles.district
		const district = this.props.session.currentDistrict
		const selectedFeed = this.props.session.selectedFeed

		const feedOptions = [
			{name: constants.FEED_TYPE_EVENT, display:'Events'},
			{name: constants.FEED_TYPE_NEWS, display:'News'},
			{name: constants.FEED_TYPE_TEAM, display:'Teams'}
		]

		const list = feedOptions.map((feed, i) => {
			let style = (selectedFeed == feed.name) ? {padding:6, marginTop:4, border:'1px solid #ddd', background:'#f9f9f9'} : {padding:6, marginTop:4}
			return (
				<li key={i}>
					<div style={style}>
						<a id={feed.name} onClick={this.selectFeed.bind(this)} href="#">{feed.display}</a>
					</div>
				</li>				
			)
		})

		return (
			<div className="feature-box center media-box fbox-bg">
				<div className="fbox-desc">

					<div style={style.title}>
						<h3>District</h3>
					</div>

					<div style={{borderTop:'1px solid #ddd', minHeight:140}}>
						<div style={style.body}>
							<span style={style.header}>{district.name}</span><br />
							<ul style={style.list}>
								{list}
							</ul>
						</div>
					</div>

					<div style={style.container}>
						<div style={style.rightBox}>
							line 1<br />
							username
						</div>
						<div style={style.body}>
							<span style={style.header}>Title</span><br />
						</div>
					</div>

					<div style={style.container}>
						<div style={style.rightBox}>
							line 1<br />
							username
						</div>
						<div style={style.body}>
							<span style={style.header}>Title</span><br />
						</div>
					</div>

					<div style={style.container}>
						<div style={style.rightBox}>
							line 1<br />
							username
						</div>
						<div style={style.body}>
							<span style={style.header}>Title</span><br />
						</div>
					</div>

					<div style={style.container}>
						<div style={style.rightBox}>
							line 1<br />
							username
						</div>
						<div style={style.body}>
							<span style={style.header}>Title</span><br />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		session: state.session // district, currentLocation, teams, selectedFeed, reload
	}
}

const dispatchToProps = (dispatch) => {
	return {
		changeSelectedFeed: (feed) => dispatch(actions.selectedFeedChanged(feed))		
	}
}

export default connect(stateToProps, dispatchToProps)(District)