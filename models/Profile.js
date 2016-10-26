var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	name: {type:String, trim:true, lowercase:true, default:''},
	username: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:''},
	email: {type:String, trim:true, lowercase:true, default:''},
	credits: {type:Number, default:0}, // first 3 are free
	password: {type:String, trim:true, default:''},
	timestamp: {type:Date, default:Date.now}
})

ProfileSchema.methods.summary = function(){
	var summary = {
		name: this.name,
		username: this.username,
		image: this.image,
		email: this.email,
		credits: this.credits,
		timestamp: this.timestamp,
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('ProfileSchema', ProfileSchema)