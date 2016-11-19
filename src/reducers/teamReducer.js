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

	switch (action.type) {

		case constants.TEAMS_RECEIVED:
//			console.log('TEAMS_RECEIVED: '+JSON.stringify(action.teams))
			return update(state, action.teams)

		case constants.DISTRICT_CHANGED:
			// when district changes, reset current teams
			var newState = Object.assign({}, state)
			newState['list'] = null

			return newState

		default:
			return state
	}
}
