import React, { Component } from 'react'
import ProfilePreview from './ProfilePreview'
import styles from './styles'

export default (props) => {

	const members = props.members
	return (
		<div>
			{ (members == null) ? null : members.map((member, i) => {
					return <ProfilePreview key={member.id} profile={member} />
				})
			}
		</div>

	)
}


const localStyle = {
	btnBlue: {
		className: 'button button-small button-circle button-blue'
	}
}

