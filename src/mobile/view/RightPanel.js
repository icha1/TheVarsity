import React, { Component } from 'react'
import Map from './Map'

class RightPanel extends Component {
	render(){

		const currentLocation = { // default to nyc
			lat: 40.73008847828741,
			lng: -73.99769308314211
		}		

		return (

	<div className="panel panel-right panel-reveal sidebar">
		<Map
			center={currentLocation} 
			zoom={14}
			height={100} />
	</div>

		)
	}
}

export default RightPanel