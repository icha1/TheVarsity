import constants from '../../constants/constants'

export default {
	initialState: {
		template: 'index', // index or index-mobile
		currentTeam: null,
		selectedFeed: constants.FEED_TYPE_ALL,
		reload: false,
		showLoading: false,
		teams: [],
		selected: {
			team: 'Projects',
			account: ''
		},
		pages: {
			account: {
				showModal: false,
				showEdit: false,
				showCreateTeam: false,
				showCreateProject: false,
				selected: ''
			},
			team: {
				selected: ''
			},
			feed: {
				selected: ''
			},
			post: {
				selected: ''
			},
			profile: {
				selected: ''
			},
			project: {
				selected: ''
			}
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
			currentTeam: null,
			selectedFeed: constants.FEED_TYPE_ALL,
			reload: false,
			showLoading: false,
			teams: [],
			selected: {
				team: 'Projects',
				account: ''
			},
			pages: {
				account: {
					showModal: false,
					showEdit: false,
					showCreateTeam: false,
					showCreateProject: false,
					selected: ''
				},
			team: {
				selected: ''
			},
			feed: {
				selected: ''
			},
			post: {
				selected: ''
			},
			profile: {
				selected: ''
			},
			project: {
				selected: ''
			}
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