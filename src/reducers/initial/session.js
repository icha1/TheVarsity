import constants from '../../constants/constants'

export default {
	initialState: {
		selected: 'Showcase',
		template: 'index', // index or index-mobile
		selectedFeed: constants.FEED_TYPE_ALL,
		reload: false,
		showLoading: false,
		showMap: false,
		teams: [],
		nearby: [], // districts nearby
		currentDistrict: {
			id: null,
			name: '',
			image: '',
			comments: [],
			recentVisitors: {}
		},
		currentLocation: { // default to nyc
			lat: 40.73008847828741,
			lng: -73.99769308314211
		}		
	},

	populate: (prestate) => {
//		console.log('TEST POPULATE')
		if (prestate == null)
			return null

		var initial = {
			template: 'index',
			selected: 'Showcase',
			selectedFeed: constants.FEED_TYPE_ALL,
			reload: false,
			showLoading: false,
			showMap: false,
			teams: [],
			nearby: [], // districts nearby
			currentDistrict: {
				id: null,
				name: '',
				image: '',
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

//		console.log('POPULATE SESSION: '+JSON.stringify(initial))

		return initial
	}	

}