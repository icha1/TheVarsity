import React, {Component} from 'react'
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps' // https://github.com/tomchentw/react-google-maps


class Map extends Component {

	render(){
		const mapContainer = <div style={{height: '100%', width:'100%'}}></div>
		const ctr = {
			lat: 40.7359745,
			lng: -73.9879513
		}

		return (
		    <GoogleMapLoader
		        containerElement = { mapContainer }
		        googleMapElement = {
			        <GoogleMap
			            defaultZoom={16}
			            defaultCenter={ctr}
			            options={{streetViewControl: false, mapTypeControl: false}}>
			        </GoogleMap>
		    	} />

		)
	}
}


export default Map