var mongoose = require('mongoose')

var FeedbackSchema = new mongoose.Schema({
	profile: {type:mongoose.Schema.Types.Mixed, default:{}},
	comment: {type:String, trim:true, default:''},
	path: {type:String, trim:true, default:''},
	timestamp: {type:Date, default:Date.now}
})

FeedbackSchema.methods.summary = function(){
	var summary = {
		profile: this.profile,
		comment: this.comment,
		path: this.path,
		timestamp: this.timestamp,
		schema: 'feedback',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('FeedbackSchema', FeedbackSchema)