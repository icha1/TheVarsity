import constants from '../constants/constants'
import { FirebaseManager } from '../utils'

var initialState = {
	currentUser: null,
	teams: [],
	notifications: [],
	firebaseConnected: false
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let teams = Object.assign([], newState.teams)
	let currentUser = Object.assign([], newState.currentUser)

	switch (action.type) {
		case constants.RECEIVED_NOTIFICATIONS:
			let notificationsArray = []
			Object.keys(action.notifications).map((key, i) => {
				notificationsArray.push(action.notifications[key])

			})
			
			newState['notifications'] = notificationsArray
			newState['firebaseConnected'] = true
			return newState

		case constants.CURRENT_USER_RECIEVED:
			newState['currentUser'] = action.user
			return newState

		case constants.TEAMS_RECEIVED:
			if (currentUser == null)
				return newState

			// check members of each team first
			action.teams.forEach((team, i) => {
				team.members.forEach((member, i) => {
					if (member.id == currentUser.id)
						teams.push(team)
				})
			})

			newState['teams'] = teams 
			return newState

		case constants.PROFILE_UPDDATED:
			if (newState.currentUser == null)
				return newState

			if (newState.currentUser.id != action.profile.id)
				return newState

			newState['currentUser'] = action.profile
			return newState

		default:
			return state
	}
}