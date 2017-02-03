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
				showEdit: true,
				showCreateTeam: false,
				showCreateProject: false,
				selected: 'Account',
				menu: ['Account', 'Notifications']
			},
			team: {
				selected: ''
			},
			feed: {
				selected: 'Recent Activity',
				menu: ['Recent Activity', 'Projects', 'Notifications']
			},
			post: {
				selected: ''
			},
			profile: {
				selected: 'Profile',
				menu: ['Profile', 'Projects']
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
					selected: 'Profile',
					menu: ['Profile', 'Projects']
				},
				team: {
					selected: ''
				},
				feed: {
					selected: 'Recent Activity',
					menu: ['Recent Activity', 'Projects', 'Notifications']
				},
				post: {
					selected: ''
				},
				profile: {
					selected: 'Profile',
					menu: ['Profile', 'Projects']
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