import React, { Component } from 'react'
import { Feed, MapNavigation, District, ProfileList, FeaturedTeams, Section } from '../containers'
import { Redeem } from '../view'
import styles from './styles'

class Home extends Component {
	render(){
		const style = styles.home

		return ( 
			<div className="clearfix">
				<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
		            <div id="header-wrap">

						<div className="container clearfix">
							<div style={{paddingTop:96}}>
								<input style={localStyle.inputWhite} type="text" placeholder="Search" />
								<FeaturedTeams />
				            </div>
			            </div>

		            </div>
				</header>

			    <section className="page-section section parallax dark" style={{background: 'url("/images/office-3.jpg") center', overflow:'visible', margin:0}} data-height-lg="425" data-height-md="425" data-height-sm="450" data-height-xs="450" data-height-xxs="450">
			        <div className="vertical-middle">
			            <div className="heading-block center nobottomborder">
			                <h1 style={styles.titleWhite} data-animate="fadeInUp">The Varsity</h1>
			                <span style={{fontWeight:100}} data-animate="fadeInUp" data-delay="300">
			                	Find Your Next Job or Hire <br />Through The Varsity in 2017
			                </span>
			                <br /><br />

			                <div data-animate="fadeIn" data-delay="800">
								<ul className="one-page-menu" data-easing="easeInOutExpo" data-speed="750" data-offset="25">
									<li><a href="#" data-href="#section-about" className="button button-circle" style={{backgroundColor:'rgb(91, 192, 222)'}}>Learn More</a></li>
								</ul>
			                </div>
			            </div>
			        </div>
			    </section>

				<section id="section-about" style={{background:'#fff', paddingTop:32}} className="page-section">
					<div className="content-wrap container clearfix">
		                <h2 style={styles.title}>What Is The Varsity</h2>
						<div className="col_two_third" style={styles.paragraph}>
							The Varsity is a collection of online communities organized into groups by skill: designers, 
							photographers, software engineers, real estate etc. Groups are curated by members 
							and maintained through an invite-only system.
							<br /><br />
							Users can tap into these groups when seeking referrals or hiring for their company. Find your next job or employee through the Varsity in 2017.
						</div>

						<div className="col_one_third col_last" style={{textAlign:'right'}}>
							<img style={localStyle.image} src="/images/girls.jpg" />
						</div>
					</div>
				</section>

			    <section style={{background:'#2e3842', borderTop:'1px solid #ddd'}} className="page-section notopmargin nobottommargin section">
			        <div className="container clearfix">
					    <h2 style={styles.titleWhite}>The Varsity Advantage</h2>

			            <div className="col_one_third">
			                <div className="heading-block fancy-title nobottomborder title-bottom-border">
			                    <h4 style={localStyle.titleWhite}>Better Opportunities</h4>
			                </div>
			                <img style={localStyle.image} src="/images/satellite-2.png" />
			                <p style={styles.paragraphWhite}>
								Every group has a bulletin board where professional opportunities are posted. Hiring companies 
								can better target specific skillsets by posting in the right groups.
			                </p>
			            </div>

			            <div className="col_one_third">
			                <div className="heading-block fancy-title nobottomborder title-bottom-border">
			                    <h4 style={localStyle.titleWhite}>Stronger Connections</h4>
			                </div>
			                <img style={localStyle.image} src="/images/kithen.jpg" />
			                <p style={styles.paragraphWhite}>
								Groups are maintained by members through invite-only. No more spam from salesman, recruiters, 
								and such. The Varsity cuts out the noise.                
			                </p>
			            </div>

			            <div className="col_one_third col_last">
			                <div className="heading-block fancy-title nobottomborder title-bottom-border">
			                    <h4 style={localStyle.titleWhite}>More Revenue</h4>
			                </div>
			                <img style={localStyle.image} src="/images/meetup.jpg" />
			                <p style={styles.paragraphWhite}>
								Group admins can charge fees for posting to the bulletin board. Fees go directly to the group 
								moderator.
								<br />
								* This is a premium feature.
			                </p>
			            </div>
			        </div>
			    </section>

			    <Section content="redeem" />

			</div>
		)
	}
}

const localStyle = {
	input: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	inputWhite: {
		color:'#333',
		background: '#fff',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	image: {
		background: '#fff', 
		border: '1px solid #ddd',
		padding: 3,
		marginBottom: 16
	},
	titleWhite: {
		color:'#fff',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		borderBottom: '2px solid #fff'
	}
}

export default Home
