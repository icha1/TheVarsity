import React, { Component } from 'react'
import { Posts, Venues } from '../containers'
import styles from './styles'

class Home extends Component {
	render(){
		const style = styles.home
		return ( 
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<Venues />
		            </div>
				</header>

				<section id="content" style={style.content}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
							<Posts />
						</div>

						<div className="col_one_third col_last">
							<div className="feature-box center media-box fbox-bg">
								<div className="fbox-desc">
									<div style={{padding:25, borderTop:'1px solid #ddd'}}>
										<h3>District</h3>
									</div>

									<div style={{borderTop:'1px solid #ddd', minHeight:140}}>
										<div style={style.body}>
											<span style={style.header}>NYU</span><br />
											<ul style={{listStyleType:'none'}}>
												<li><a href="#">Events</a></li>
												<li>Services</li>
												<li>Jobs</li>
												<li>News</li>
												<li>Chat</li>
											</ul>
										</div>
									</div>

									<div style={style.container}>
										<div style={style.dateBox}>
											line 1<br />
											username
										</div>
										<div style={style.body}>
											<span style={style.header}>Title</span><br />
										</div>
									</div>

									<div style={style.container}>
										<div style={style.dateBox}>
											line 1<br />
											username
										</div>
										<div style={style.body}>
											<span style={style.header}>Title</span><br />
										</div>
									</div>

									<div style={style.container}>
										<div style={style.dateBox}>
											line 1<br />
											username
										</div>
										<div style={style.body}>
											<span style={style.header}>Title</span><br />
										</div>
									</div>

									<div style={style.container}>
										<div style={style.dateBox}>
											line 1<br />
											username
										</div>
										<div style={style.body}>
											<span style={style.header}>Title</span><br />
										</div>
									</div>

								</div>
							</div>
						</div>

					</div>

				</section>
			</div>
		)
	}
}

export default Home
