import React, { Component } from 'react'
import { ProfilePreview } from '../view'
import { connect } from 'react-redux'
import { APIManager } from '../../utils'
import actions from '../../actions/actions'

class ProfileList extends Component {
	constructor(){
		super()
		this.state = {
			profiles: null
		}
	}

	componentDidUpdate(){
		const district = this.props.session.currentDistrict
		if (district.id == null)
			return

		if (this.props.profiles.districtMap[district.id] != null)
			return

		this.props.fetchProfiles({districts: district.id})
	}

	render(){
		const district = this.props.session.currentDistrict
		let profileList = null

		const list = this.props.profiles.districtMap[district.id]
		if (list != null){
			profileList = list.map((profile, i) => {
				return <ProfilePreview key={profile.id} profile={profile} />
			})
		}

		return (
			<div>
				<input style={{width:100+'%', border:'none', padding:6}} type="text" placeholder="Search" />
				<hr />
				{ profileList }
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		session: state.session,
		user: state.account.currentUser,
		profiles: state.profile
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchProfiles: (params) => dispatch(actions.fetchProfiles(params))

	}
}

export default connect(stateToProps, dispatchToProps)(ProfileList)