import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by slug
	list: null
}


const update = (state, teams) => {
	var newState = Object.assign({}, state)
	var array = (newState.list == null) ? [] : Object.assign([], newState.list)
	var teamsMap = Object.assign({}, newState.map)

	teams.forEach(team => {
		if (teamsMap[team.slug] == null){
			teamsMap[team.slug] = team
			array.push(team)
		}
	})

	newState['list'] = array
	newState['map'] = teamsMap
	return newState
}

export default (state = initialState, action) => {
	let newState = Object.assign({}, state)
	let array = (newState.list == null) ? [] : Object.assign([], newState.list)
	let teamsMap = Object.assign({}, newState.map)

	switch (action.type) {

		case constants.TEAMS_RECEIVED:
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.teams))
			return update(state, action.teams)

		case constants.TEAM_UPDATED:
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.teams))


			return newState

		case constants.DISTRICT_CHANGED:
			// when district changes, reset current teams
			newState['list'] = null

			return newState

		default:
			return state
	}
}
