import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { APIManager } from '../../utils'
import { Comment } from '../view'
import styles from './styles'

class ProfileDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 0,
			menuItems: [
				{name:'Posts', component:'Posts'},
				{name:'Teams', component:'CreatePost'},
				{name:'Direct Message', component:'ManageNotifications'}
			]
		}
	}

	componentDidMount(){
		const profile = this.props.profiles[this.props.slug]
		if (profile)
			return

		APIManager.handleGet('/api/profile', {username:this.props.slug}, (err, response) => {
			if (err){
				alert(err)
				return
			}

			console.log(JSON.stringify(response))
			this.props.profilesReceived(response.results)
		})
	}

	selectItem(index, event){
		event.preventDefault()

		const item = this.state.menuItems
		this.setState({
			selected: index
		})
	}

	render(){
		const style = styles.post
		const profile = this.props.profiles[this.props.slug] // can be null

		const username = (profile) ? profile.username : username


		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (i == this.state.selected) ? styles.team.selected : styles.team.menuItem
			return (
				<li key={i}>
					<div style={itemStyle}>
						<a onClick={this.selectItem.bind(this, i)} href="#"><div>{item.name}</div></a>
					</div>
				</li>
			)
		})		

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>

								<img style={{padding:3, border:'1px solid #ddd'}} src={profile.image+'=s140'} />
								<h2 style={style.title}>
									{ username }
								</h2>
								<hr />
								<nav id="primary-menu">
									<ul>{sideMenu}</ul>
								</nav>

							</div>
			            </div>

		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">

						<div className="col_full col_last">
							Profile Detail Page
						</div>
					</div>

				</section>

			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		profiles: state.profile.map,
		session: state.session,
		posts: state.post.map,
		teams: state.team.map
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		profilesReceived: profiles => dispatch(actions.profilesReceived(profiles))
	}
}

export default connect(stateToProps, mapDispatchToProps)(ProfileDetail)
