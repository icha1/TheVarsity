import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'

class ProfilePreview extends Component {
	render(){
		const profile = this.props.profile
		const image = (profile.image.length == 0) ? '/images/logo-round.png' : profile.image+'=s44-c'

		let titleStyle = styles.title
		titleStyle['fontSize'] = 18
		titleStyle['lineHeight'] = 10+'px'

		return (
			<div style={{padding:16}}>
				<Link to={'/profile/'+profile.slug}>
					<img style={localStyle.image} src={image} />
				</Link>
				<Link style={titleStyle} to={'/profile/'+profile.slug}>
					{ profile.username }
				</Link>
				<br />
				<span style={{fontWeight:100, fontSize:14, lineHeight:14+'px'}}>{ profile.title }</span>
			</div>
		)
	}
}

const localStyle = {
	image: {
		float:'left',
		marginRight:12,
		borderRadius:22,
		width:44
	}
}

export default ProfilePreview