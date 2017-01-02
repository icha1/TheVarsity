var mongoose = require('mongoose')

var InvitationSchema = new mongoose.Schema({
	from: {type:String, trim:true, default:''},
	name: {type:String, trim:true, default:''},
	email: {type:String, trim:true, default:''},
	code: {type:String, trim:true, default:''},
	timestamp: {type:Date, default:Date.now}
})

InvitationSchema.methods.summary = function(){
	var summary = {
		from: this.from,
		name: this.name,
		email: this.email,
		code: this.code,
		timestamp: this.timestamp,
		schema: 'invitation',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('InvitationSchema', InvitationSchema)