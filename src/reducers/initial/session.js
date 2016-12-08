import constants from '../../constants/constants'

export default {
	initialState: {
		template: 'index', // index or index-mobile
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

	populate: (prestate) => {
		if (prestate == null)
			return null

		var initial = {
			template: 'index',
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
		}

		Object.keys(prestate).forEach((key, i) => {
			initial[key] = prestate[key]
		})

		return initial
	}	

}