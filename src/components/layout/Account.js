import React, { Component } from 'react'
import styles from './styles'
import { EditProfile } from '../view'
import { connect } from 'react-redux'

class Account extends Component {
	constructor(){
		super()
		this.state = {
			showEdit: false,
			selected: 'Profile',
			menuItems: [
				'Profile',
				'Teams',
				'Saved',
				'Messages'
			]
		}
	}

	selectItem(item, event){
		event.preventDefault()

		// const item = this.state.menuItems
		this.setState({
			selected: item
		})
	}

	render(){
		const style = styles.account

		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (item == this.state.selected) ? style.selected : style.menuItem
			return (
				<li key={i}>
					<div style={itemStyle}>
						<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
					</div>
				</li>
			)
		})

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">

							<nav id="primary-menu" style={{paddingTop:96}}>
								<ul>{sideMenu}</ul>
							</nav>

			            </div>
		            </div>
				</header>

				<section id="content" style={style.content}>
					<div className="content-wrap container clearfix">

						<div className="col_two_third">
							<EditProfile profile={this.props.user} />
						</div>

						<div className="col_one_third col_last">
							Right Side
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
	}
}
export default connect(stateToProps)(Account)