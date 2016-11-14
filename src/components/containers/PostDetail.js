import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Comment } from '../view'
import styles from './styles'

class PostDetail extends Component {

	componentDidMount(){
		
	}

	render(){
		const style = styles.post
		const post = this.props.posts[this.props.slug]

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>
								Hosted By<br />
								<img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={post.author.image+'=s140'} />
								<h2 style={style.title}>
									{ post.author.name }
								</h2>
								<hr />


							</div>
			            </div>

		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">

						<div className="col_full col_last">
							<h2 style={style.title}>
								{ post.title }
							</h2>
							<p>{ post.text }</p>
							<img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={post.image} />

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
