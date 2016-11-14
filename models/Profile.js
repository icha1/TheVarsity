var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	username: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:process.env.DEFAULT_PROFILE_IMAGE},
	email: {type:String, trim:true, lowercase:true, default:''},
	credits: {type:Number, default:0}, // first 3 are free
	password: {type:String, trim:true, default:''},
	social: {type:mongoose.Schema.Types.Mixed, default:{}},
	timestamp: {type:Date, default:Date.now}
})

ProfileSchema.methods.summary = function(){
	var summary = {
		username: this.username,
		slug: this.slug,
		image: this.image,
		email: this.email,
		credits: this.credits,
		social: this.social,
		timestamp: this.timestamp,
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('ProfileSchema', ProfileSchema)