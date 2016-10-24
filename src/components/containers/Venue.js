import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { APIManager } from '../../utils'
import store from '../../stores/store'
import actions from '../../actions/actions'
import { Map } from '../view'

class Venue extends Component {
	constructor(){
		super()
		this.state = {

		}
	}

	componentDidMount(){

	}

	uploadImage(files){
		console.log('uploadImage')
		APIManager.upload(files[0], (err, image) => {
			if (err){
				alert(err)
				return
			}

			// {"id":"fah0GA-4",
			// "address":"https://lh3.googleusercontent.com/BdHyl0Uzoq-MHbMLYx_n8IAKGrbRz2XhIdXBu3DjGd8rJLJRecVuBajNzOrhdI6BUe9njw3CqvthbzQQsHUjkupkMA",
			// "name":"apple.png",
			// "key":"AMIfv970_ybaBPO2Thty_bUCOyltTed9RWxww-2OYwQVeMtSLpbxxqH2ilWMiLvwODbCUSGgmASD02YIlkMKG7WYtqPcJqX58RyRigRchcOursW482o54uta75kkqFTxCwgpl9clcEhGTiMG-Qkf5pLZ_1GaXz4BWGKI4tlvM0cpCWhfah0GA-4"}			

			const venue = this.props.venues[this.props.slug]
			let updated = Object.assign({}, venue)
			updated['image'] = image.address
//			console.log(JSON.stringify(updated))

			const url = '/api/venue/'+updated.id
			APIManager.handlePut(url, updated, (error, response) => {

				console.log(JSON.stringify(response))

			})


		})
	}

	render(){
		const venue = this.props.venues[this.props.slug]
		const center = {
			lat: venue.geo[0],
			lng: venue.geo[1]
		}

		return (
			<div className="clearfix">

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<Map center={center} zoom={17} animation={2} markers={[venue]} />
		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">

						<div className="col_full col_last">
							{ venue.name }
							<br />
							<a href={'/scrape?venue='+venue.id}>Scrape</a>
							<br />
							<img src={venue.image+'=s220'} />
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
		venues: state.venue.map
	}
}

export default connect(stateToProps)(Venue)
