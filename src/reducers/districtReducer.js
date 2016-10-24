import constants from '../constants/constants'

var initialState = {
	currentDistrict: {
		id: null,
		name: 'None'
	}
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.DISTRICT_CHANGED:
			console.log('DISTRICT_CHANGED'+JSON.stringify(action.districts))
			var newState = Object.assign({}, state)
			const list = action.districts
			if (list.length == 0){ // reset to null
				newState['currentDistrict'] = {
					id: null,
					name: 'None'
				}

				return newState				
			}

			const district = list[0]
			newState['currentDistrict'] = district
			return newState

		default:
			return state
	}

}