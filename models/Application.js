var mongoose = require('mongoose')

var ApplicationSchema = new mongoose.Schema({
	post: {type:String, trim:true, default:''},
	from: {type:String, trim:true, default:''},
	recipients: {type:Array, default:[]},
	projects: {type:Array, default:[]},
	attachments: {type:Array, default:[]},
	timestamp: {type:Date, default:Date.now}
})

ApplicationSchema.methods.summary = function(){
	var summary = {
		post: this.post,
		from: this.from,
		recipients: this.recipients,
		projects: this.projects,
		attachments: this.attachments,
		timestamp: this.timestamp,
		schema: 'application',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('ApplicationSchema', ApplicationSchema)