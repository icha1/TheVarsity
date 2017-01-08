import React, { Component } from 'react'
import { Link } from 'react-router'
import { TextUtils } from '../../utils'
import styles from './styles'

class ProfilePreview extends Component {

	render(){
		const profile = this.props.profile
		const image = (profile.image.length == 0) ? '/images/logo-round.png' : profile.image+'=s320-c'
		const style = styles.post

		return (
			<div>
			    <div className="col-sm-6 col-md-6 hidden-xs">
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

				{ /* mobile ui */ }
				<div className="clearfix visible-xs" style={{borderBottom:'1px solid #ededed', padding:'16px 0px 16px 24px'}}>
					<div className="comment-content clearfix" style={{textAlign:'left'}}>
						<Link to={'/profile/'+profile.slug}>
							<img alt='The Varsity' className='avatar avatar-60 photo' style={{borderRadius:24, float:'right', marginRight:12}} src={image} width="48" height="48" />
						</Link>
						<div style={{marginBottom: 25}}>
							<Link to={'/profile/'+profile.slug}>
								<h3 style={style.header}>{ profile.username }</h3>
							</Link>
							<p style={{marginTop:0}} dangerouslySetInnerHTML={{__html:TextUtils.truncateText(profile.bio, 60)}}></p>
						</div>
					</div>
					<div style={{paddingRight:12}}>
						<span style={localStyle.detail}>{ TextUtils.capitalize(profile.location.city) }</span>
						<span style={localStyle.separator}>|</span>
						<span style={localStyle.detail}><Link to={'/profile/'+profile.slug+'?selected=chat'}>{profile.title}</Link></span>
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
	detailRed: {
		float:'right',
		color: 'red',
		fontWeight:400,
		fontSize:12,
		lineHeight:12+'px'
	},
	detail: {
		float:'right',
		color: '#1265A8',
		fontWeight:100,
		fontSize:12,
		lineHeight:12+'px'
	},
	separator: {
		float:'right',
		color: '#1265A8',
		fontWeight:100,
		fontSize:10,
		lineHeight:10+'px',
		marginLeft:6,
		marginRight:6
	}	
}

export default ProfilePreview