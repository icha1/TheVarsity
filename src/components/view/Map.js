import React, {Component} from 'react'
import { GoogleMapLoader, GoogleMap, Marker, Circle } from 'react-google-maps' // https://github.com/tomchentw/react-google-maps
import { browserHistory } from 'react-router'

class Map extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			map: null
		}
	}

	mapDragged(){
		var latLng = this.state.map.getCenter().toJSON()
		if (this.props.mapMoved != null)
			this.props.mapMoved(latLng)
	}

	mapZoomChanged(){
//		console.log('MAP ZOOME CHANGED: '+this.state.map.getZoom())
		if (this.props.mapZoomChanged != null)
			this.props.mapZoomChanged(this.state.map.getZoom())
	}

	handleMarkerClick(marker){
		console.log('MarkerClick: '+JSON.stringify(marker))
		browserHistory.push('/team/'+marker.slug)
	}

	render(){
		var markers = null
		if (this.props.markers != null){
			markers = this.props.markers.map((marker, i) => {
				marker['defaultAnimation'] = this.props.animation
				marker['icon'] = (marker.image.length == 0) ? '/images/icons/map-icon.png' : marker.image+'=s60-c'
				marker['position'] = {
					lat: marker.geo[0],
					lng: marker.geo[1]
				}
				
		        return (
		            <Marker 
		            	key={i} 
		            	clickable={true} 
		            	icon={marker.icon} 
		            	label={marker.title} 
		            	title={marker.key} 
		            	onClick={this.handleMarkerClick.bind(this, marker)} 
		            	{...marker} />
		        )
			})
		}

		const mapContainer = <div style={{height: '100%', width:'100%'}}></div>
		return (
		    <GoogleMapLoader
		        containerElement = { mapContainer }
		        googleMapElement = {
			        <GoogleMap
			            ref={ (map) => {
				            	if (this.state.map != null)
				            		return
				            	
			            		this.setState({map: map})
			             	} 
			         	}

			            onDragend={this.mapDragged.bind(this)}
			            onZoomChanged={this.mapZoomChanged.bind(this)}
			            defaultZoom={this.props.zoom}
			            defaultCenter={this.props.center}
			            options={{streetViewControl: false, mapTypeControl: false}}>
			            { markers }
			        </GoogleMap>
		    	} />
		)
	}
}


export default Map