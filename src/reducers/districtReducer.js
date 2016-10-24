import constants from '../constants/constants'

var initialState = {
	currentDistrict: {
		id: null,
		name: ''
	}
}

export default (state = initialState, action) => {

	switch (action.type) {

		case constants.DISTRICT_CHANGED:
			console.log('DISTRICT_CHANGED')
			var newState = Object.assign({}, state)
			const list = action.districts
			if (list.length == 0)
				return newState

			const district = list[0]
			newState['currentDistrict'] = district
			return newState

		default:
			return state
	}

}