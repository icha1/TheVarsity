import React, { Component } from 'react'
import styles from './styles'
import { Link } from 'react-router'
import { TextUtils } from '../../utils'

class ProfilePreview extends Component {
	render(){
		const profile = this.props.profile
		const image = (profile.image.length == 0) ? '/images/logo-round.png' : profile.image+'=s320-c'

		return (
		    <div className="col-sm-6 col-md-6">
				<div className="thumbnail">
				    <div className="caption">
                        <img style={localStyle.icon} src={image} />
		                <div className="heading-block fancy-title nobottomborder" style={localStyle.paragraph}>
		                    <h4 style={styles.title}>
								<Link style={{color:'#333'}} to={'/profile/'+profile.slug}>{ profile.username }</Link>
		                    </h4>
		                    <br />
							{ (profile.title.length == 0) ? 'No title' : profile.title }
		                </div>
						<hr />
						<p style={localStyle.paragraph}>
							{ TextUtils.truncateText(profile.bio, 60) }
						</p>
						<div style={{textAlign:'right'}}>
							<Link to={'/profile/'+profile.slug} className="button button-small button-circle button-border button-aqua" role="button">View</Link>
						</div>
				    </div>
				</div>
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
	},
    icon: {
        float: 'left',
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12
    },
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100
	},
	paragraph: {
		fontWeight: 200
	},
}

export default ProfilePreview