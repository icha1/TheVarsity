import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { APIManager } from '../../utils'
import store from '../../stores/store'
import actions from '../../actions/actions'
import styles from './styles'

class District extends Component {
	selectFeed(event){
		event.preventDefault()
		store.currentStore().dispatch(actions.selectedFeedChanged(event.target.id))
	}

	render(){
		const style = styles.district
		const district = this.props.district

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
								<li><a id="event" onClick={this.selectFeed.bind(this)} href="#">Events</a></li>
								<li><a id="article" onClick={this.selectFeed.bind(this)} href="#">News</a></li>
								<li><a href="#">Teams</a></li>
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
		location: state.session.currentLocation,
		district: state.district.currentDistrict
	}
}

export default connect(stateToProps)(District)