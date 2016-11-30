import React, { Component } from 'react'
import { Link } from 'react-router'
import { DateUtils, TextUtils } from '../../utils'
import styles from './styles'

class EditProfile extends Component {
	constructor(){
		super()
		this.state = {
			updatedProfile: {
				changed: false

			}
		}
	}

	btnCloseClicked(event){
		event.preventDefault()
		if (this.state.updatedProfile.changed){
			let updated = Object.assign({}, this.state.updatedProfile)
			delete updated['changed']
			this.props.update(updated)
			return
		}

		this.props.close()
	}

	updateProfile(event){
		let updated = Object.assign({}, this.state.updatedProfile)
		updated[event.target.id] = event.target.value
		updated['changed'] = true
		this.setState({
			updatedProfile: updated
		})
	}

	render(){
		const profile = this.props.profile

		return (
			<div className={styles.post.container.className} style={styles.post.container}>
				<button onClick={this.btnCloseClicked.bind(this)} style={{float:'right'}}>Done</button>
				<h2 style={styles.post.title}>Update Profile</h2>
				<hr />
				<textarea id="bio" onChange={this.updateProfile.bind(this)} style={{border:'none', background:'#F8F9F9', width:'100%', minHeight:220, padding:8, resize:'none'}} defaultValue={profile.bio}></textarea>
			</div>
		)
	}
}


export default EditProfile