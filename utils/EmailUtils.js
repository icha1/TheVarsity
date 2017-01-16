var Promise = require('bluebird')
var helper = require('sendgrid').mail

module.exports = {

	sendEmail: function(from, recipient, subject, text){
		return new Promise(function (resolve, reject){
			var content = new helper.Content('text/html', text)
			var mail = new helper.Mail(helper.Email(from), subject, helper.Email(recipient), content)

			var body = mail.toJSON()
//			body['from']['name'] = process.env.DEFAULT_EMAIL_SENDER
			
			var sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
			var request = sg.emptyRequest({
			    method: 'POST',
			    path: '/v3/mail/send',
			    body: body
			})

			sg.API(request, function(error, response) {
				if (error){
					reject(error)
					return
				}

				resolve(response.body)
			})
		})
	}

	// sendEmail: function(from, recipient, subject, text){
		// return new Promise(function (resolve, reject){

	// 		var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD)
	// 		sendgrid.send({
	// 			to:       recipient,
	// 			from:     from,
	// 			fromname: 'Perc',
	// 			subject:  subject,
	// 			text:     text
	// 		}, function(err) {
	// 			if (err) {reject(err); }
	// 			else { resolve(); }
	// 		})
		// })
	// },

	// sendEmails: function(from, recipients, subject, text){
	// 	return new Promise(function (resolve, reject){

	// 		var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD)
	// 		for (var i=0; i<recipients.length; i++){
	// 			var recipient = recipients[i]
	// 			if (recipient.indexOf('@') == -1) // invalid
	// 				continue

	// 			sendgrid.send({
	// 				to:       recipient,
	// 				from:     from,
	// 				fromname: 'Perc',
	// 				subject:  subject,
	// 				text:     text
	// 			}, function(err) {
	// 				// if (err) {reject(err); }
	// 				// else { resolve(); }
	// 			})
	// 		}

	// 		resolve()
	// 	})
	// },	

	// sendHtmlEmail: function(from, recipient, subject, html){
	// 	return new Promise(function (resolve, reject){

	// 		var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD)
	// 		sendgrid.send({
	// 			to:       recipient,
	// 			from:     from,
	// 			fromname: 'Perc',
	// 			subject:  subject,
	// 			html:     html
	// 		}, function(err) {
	// 			if (err) {reject(err) }
	// 			else { resolve() }
	// 		})
	// 	})
	// }



}