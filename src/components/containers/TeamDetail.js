import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { APIManager } from '../../utils'
import store from '../../stores/store'
import actions from '../../actions/actions'
import { Map } from '../view'

class TeamDetail extends Component {

	uploadImage(files){
		APIManager.upload(files[0], (err, image) => {
			if (err){
				alert(err)
				return
			}

			const team = this.props.teams[this.props.slug]
			let updated = Object.assign({}, team)
			updated['image'] = image.address

			const url = '/api/team/'+updated.id
			APIManager.handlePut(url, updated, (error, response) => {
				console.log(JSON.stringify(response))
				const result = response.result
				store.currentStore().dispatch(actions.teamsReceived([result]))
			})
		})
	}

	render(){
		const team = this.props.teams[this.props.slug]
		const center = {
			lat: team.geo[0],
			lng: team.geo[1]
		}

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<Map center={center} zoom={17} animation={2} markers={[team]} />
		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">

						<div className="col_full col_last">
							{ team.name }
							<br />
							<a href={'/scrape?team='+team.id}>Scrape</a>
							<br />
							<img src={team.image+'=s220'} />
							<br /><br />

				            <Dropzone onDrop={this.uploadImage.bind(this)}>
				              	Upload Image Here<br />
				            </Dropzone>

						</div>
					</div>
				</section>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		teams: state.team.map
	}
}

export default connect(stateToProps)(TeamDetail)
