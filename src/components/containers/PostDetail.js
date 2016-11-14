import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Comment } from '../view'
import styles from './styles'

class PostDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 0,
			menuItems: [
				{name:'Overview', component:'Posts'},
				{name:'Attend', component:'CreatePost'},
				{name:'Comments', component:'ManageNotifications'}
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
		const style = styles.post
		const post = this.props.posts[this.props.slug]

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
								Hosted By<br />
								<img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={post.author.image+'=s140'} />
								<h2 style={ style.title }>
									{ post.author.name }
								</h2>
								<hr />
								<nav id="primary-menu">
									<ul>{ sideMenu }</ul>
								</nav>

							</div>
			            </div>

		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">

						<div className="col_full col_last">

							<div style={{background:'#fff', padding:24, border:'1px solid #ddd', borderRadius:2}}>
								<h2 style={style.title}>
									{ post.title }
								</h2>
								<hr />
								<p className="lead">{ post.text }</p>
								<img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={post.image} />
							</div>

						</div>
					</div>

				</section>

			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		session: state.session,
		posts: state.post.map,
		teams: state.team.map
	}
}

export default connect(stateToProps)(PostDetail)
