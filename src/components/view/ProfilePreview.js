import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'

class ProfilePreview extends Component {
	render(){
		const profile = this.props.profile

		return (
			<div style={{borderBottom:'1px solid #ddd', padding:16}}>
				<img style={{align:'left', marginRight:12, borderRadius:18}} src={profile.image+'=s36-c'} />
				<Link to={'/profile/'+profile.username}>
					{ profile.username }
				</Link>
			</div>
		)
	}
}

export default ProfilePreview