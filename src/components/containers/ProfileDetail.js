import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Comment } from '../view'
import styles from './styles'

class ProfileDetail extends Component {

	componentDidMount(){

	}

	render(){
		const style = styles.post
//		const post = this.props.posts[this.props.slug]

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">

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
		session: state.session,
		posts: state.post.map,
		teams: state.team.map
	}
}

export default connect(stateToProps)(ProfileDetail)
