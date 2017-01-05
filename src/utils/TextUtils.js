export default {

	truncateText: (str, limit) => {
		if (str.length < limit)
			return str

		return str.substring(0, limit)+'...'
	},

	capitalize: (str) => {
		if (str.length == 1)
			return str.toUpperCase()

		var firstLetter = str.substring(0, 1)
		return firstLetter.toUpperCase() + str.substring(1)
	},

	convertToHtml: (str) => {
		var find = '\n'
		var re = new RegExp(find, 'g')
        var html = str.replace(re, '<br />')

	    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
		html = html.replace(exp, "<a href='$1' target='_blank' style='color:red'>$1</a>")

	    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		html = html.replace(emailRe, "<a href='mailto:$1' target='_blank' style='color:red'>$1</a>")


        return html
	},

	stringToArray: (str, separator) => {
		var t = str.split(separator)
		var array = []
		for (var i=0; i<t.length; i++){
			var tag = t[i]
			if (tag.length == 0)
				continue

			array.push(tag.trim())
		}

		return array
	},

	validateEmail: (email) => {
	    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	    return re.test(email)
	},

	randomString: (limit) => {
	    var text = ''
	    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	    for (var i=0; i <limit; i++)
	        text += possible.charAt(Math.floor(Math.random() * possible.length))

	    return text
	}
}