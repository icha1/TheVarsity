import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CreateComment, Comment, ProfilePreview } from '../view'
import actions from '../../actions/actions'
import styles from './styles'

class TeamDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Posts',
			menuItems: [
				'Posts',
				'Members',
				'Chat'
			]
		}
	}

	componentDidMount(){
		const team = this.props.teams[this.props.slug]

		// Track view count:
		const userId = (this.props.user == null) ? 'unregistered' : this.props.user.id
		let updatedViewed = Object.assign({}, team.viewed)
		updatedViewed[userId] = (updatedViewed[userId] == null) ? 1 : updatedViewed[userId]+1
		let total = 0
		Object.keys(updatedViewed).forEach((key, i) => {
			if (key != 'total')
				total += updatedViewed[key]
		})

		updatedViewed['total'] = total
		this.props.updateTeam(team, {viewed: updatedViewed})		
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)

		this.setState({
			selected: item
		})
	}

	render(){
		const team = this.props.teams[this.props.slug]
		const style = styles.team

		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (item == this.state.selected) ? style.selected : style.menuItem
			return (
				<li key={item}>
					<div style={itemStyle}>
						<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
					</div>
				</li>
			)
		})

		let content = null
		const selected = this.state.selected
		if (selected == 'Posts'){

		}

		if (selected == 'Members'){
			content = (
				<div className="feature-box center media-box fbox-bg">
					<div className="fbox-desc">

						<div style={{textAlign:'left', padding:24, borderTop:'1px solid #ddd'}}>
							<h2 style={{fontFamily:'Pathway Gothic One', marginBottom:0, fontWeight:100}}>Members</h2>
						</div>


						<div style={{borderTop:'1px solid #ddd', textAlign:'left'}}>
								{
									team.members.map((member, i) => {
										return (
											<ProfilePreview key={member.id} profile={member} />
										)
									})
								}
						</div>

					</div>
				</div>
			)			
		}

		if (selected == 'Chat'){
			
		}

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>

								<img style={{padding:3, border:'1px solid #ddd'}} src={team.image+'=s140'} />
								<h2 style={style.title}>{ team.name }</h2>
								{ this.props.session.currentDistrict.name }

								<hr />
								<nav id="primary-menu">
									<ul>{sideMenu}</ul>
								</nav>

								<a href={'/scrape?team='+team.id}>Scrape</a>
							</div>
			            </div>

		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
							{ content }
						</div>


					</div>
				</section>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		session: state.session, // currentDistrict, currentLocation, teams, selectedFeed, reload
		teams: state.team.map
	}
}

const dispatchToProps = (dispatch) => {
	return {
		updateTeam: (team, params) => dispatch(actions.updateTeam(team, params))

	}
}

export default connect(stateToProps, dispatchToProps)(TeamDetail)
