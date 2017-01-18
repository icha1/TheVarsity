import React, { Component } from 'react'
import ProfilePreview from './ProfilePreview'
import styles from './styles'

export default (props) => {

	const members = props.members
	return (
		<div>
			<div style={{textAlign:'right', marginBottom:24}}>
				{ (props.memberFound(props.user, props.team.members)) ? <button onClick={props.toggleInvite.bind(this)} style={localStyle.btnBlue} className={localStyle.btnBlue.className}>Invite Member</button> : null }
			</div>
			<div>
				{ (members == null) ? null : members.map((member, i) => {
						return <ProfilePreview key={member.id} profile={member} />
					})
				}
			</div>
		</div>

	)
}


const localStyle = {
	btnBlue: {
		className: 'button button-small button-circle button-blue'
	}
}

