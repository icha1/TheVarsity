import constants from '../../constants/constants'

export default {
	initialState: {
		selectedFeed: constants.FEED_TYPE_NEWS,
		reload: false,
		showLoading: false,
		teams: [],
		nearby: [], // districts nearby
		currentDistrict: {
			id: null,
			name: '',
			comments: [],
			recentVisitors: {}
		},
		currentLocation: { // default to nyc
			lat: 40.73008847828741,
			lng: -73.99769308314211
		}		
	},

	populate: (latLng) => {
		if (latLng == null)
			return null

		var initial = {
			selectedFeed: constants.FEED_TYPE_NEWS,
			reload: false,
			showLoading: false,
			teams: [],
			nearby: [], // districts nearby
			currentDistrict: {
				id: null,
				name: '',
				comments: [],
				recentVisitors: {}
			},
			currentLocation: { // default to nyc
				lat: latLng.lat,
				lng: latLng.lng
			}		
		}

		return initial
	}	

}