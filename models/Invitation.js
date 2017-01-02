var mongoose = require('mongoose')

var InvitationSchema = new mongoose.Schema({
	name: {type:String, trim:true, default:''},
	email: {type:String, trim:true, default:''},
	code: {type:String, trim:true, default:''},
	from: {type:mongoose.Schema.Types.Mixed, default:{}}, // id, email
	team: {type:mongoose.Schema.Types.Mixed, default:{}}, // have to be invited to a team
	timestamp: {type:Date, default:Date.now}
})

InvitationSchema.methods.summary = function(){
	var summary = {
		from: this.from,
		name: this.name,
		email: this.email,
		code: this.code,
		team: this.team,
		timestamp: this.timestamp,
		schema: 'invitation',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('InvitationSchema', InvitationSchema)