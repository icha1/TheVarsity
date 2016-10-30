import React, { Component } from 'react'
import styles from './styles'

class Account extends Component {
	constructor(){
		super()
		this.state = {
			selected: 0,
			menuItems: [
				{name:'Listings', component:'Posts'},
				{name:'Teams', component:'CreatePost'},
				{name:'Posts', component:'ManageNotifications'}
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
		const style = styles.account

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

							<nav id="primary-menu" style={{paddingTop:96}}>
								<ul>{sideMenu}</ul>
							</nav>

			            </div>
		            </div>
				</header>

				<section id="content" style={style.content}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
							Account Page
						</div>

					</div>
				</section>
			</div>
		)
	}
}

export default Account