import firebase from 'firebase'

var	databaseRef = null
const config = {
    apiKey: 'AIzaSyAdKSGhUOw1_-PNq9n9vXDkk_nuXj0lZzE',
    authDomain: 'thevarsity-6abb7.firebaseapp.com',
    databaseURL: 'https://thevarsity-6abb7.firebaseio.com',
    storageBucket: 'thevarsity-6abb7.appspot.com',
    messagingSenderId: '566744350980'
}

export default {

	configure: () => {
		firebase.initializeApp(config)
		databaseRef = firebase.database()
	},

	database: () => {
		if (databaseRef != null)
			return databaseRef

		firebase.initializeApp(config)
		databaseRef = firebase.database()
		return databaseRef
	}

}