import React, { Component } from 'react'
import { ProfilePreview } from '../view'
import { connect } from 'react-redux'

class ProfileList extends Component {
	render(){
		const district = this.props.session.currentDistrict
		const recentVisitors = district.recentVisitors
		const visitors = Object.keys(recentVisitors).map((id, i) => {
			const visitor = recentVisitors[id].visitor
			return <ProfilePreview key={visitor.id} profile={visitor} />
		})


		return (
			<div>
				{ visitors }
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		session: state.session,
		user: state.account.currentUser
	}
}

export default connect(stateToProps)(ProfileList)