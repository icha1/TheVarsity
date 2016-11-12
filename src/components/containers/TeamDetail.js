import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import styles from './styles'

class TeamDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 0,
			menuItems: [
				{name:'Posts', component:'Posts'},
				{name:'Members', component:'CreatePost'},
				{name:'Chat', component:'ManageNotifications'}
			]
		}
	}

	selectItem(index, event){
		event.preventDefault()

		const item = this.state.menuItems
		this.setState({
			selected: index
		})
	}

	render(){
		const team = this.props.teams[this.props.slug]
		const style = styles.team

		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (i == this.state.selected) ? style.selected : style.menuItem
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

								<img style={{padding:3, border:'1px solid #ddd'}} src={team.image+'=s140'} />
								<h2 style={style.title}>
									{ team.name }
								</h2>
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
						<div className="col_full col_last">



						</div>
					</div>
				</section>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		session: state.session, // currentDistrict, currentLocation, teams, selectedFeed, reload
		teams: state.team.map
	}
}

export default connect(stateToProps)(TeamDetail)
