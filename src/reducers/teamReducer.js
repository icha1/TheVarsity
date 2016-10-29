import constants from '../constants/constants'

var initialState = {
	map: {}, // organized by slug
	list: []
}


const update = (state, teams) => {
	var newState = Object.assign({}, state)
	var array = Object.assign([], newState.list)
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
//			console.log('VENUES_RECEIVED')
			return update(state, action.teams)

		default:
			return state
	}
}
