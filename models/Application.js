var mongoose = require('mongoose')

var ApplicationSchema = new mongoose.Schema({
	name: {type:String, trim:true, default:''},
	timestamp: {type:Date, default:Date.now}
})

ApplicationSchema.methods.summary = function(){
	var summary = {
		name: this.name,
		timestamp: this.timestamp,
		schema: 'application',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('ApplicationSchema', ApplicationSchema)