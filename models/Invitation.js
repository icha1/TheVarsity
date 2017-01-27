var mongoose = require('mongoose')

var InvitationSchema = new mongoose.Schema({
	name: {type:String, trim:true, default:''},
	email: {type:String, trim:true, lowercase:true, default:''},
	code: {type:String, trim:true, lowercase:true, default:''},
	from: {type:mongoose.Schema.Types.Mixed, default:{}}, // id, email
	team: {type:mongoose.Schema.Types.Mixed, default:{}}, // have to be invited to a team
	context: {type:mongoose.Schema.Types.Mixed, default:{}}, // invited to a team or project
	status: {type:String, trim:true, default:'open'},
	timestamp: {type:Date, default:Date.now}
})

InvitationSchema.methods.summary = function(){
	var summary = {
		from: this.from,
		name: this.name,
		email: this.email,
		code: this.code,
		team: this.team,
		context: this.context,
		status: this.status,
		timestamp: this.timestamp,
		schema: 'invitation',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('InvitationSchema', InvitationSchema)