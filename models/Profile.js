var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	username: {type:String, trim:true, default:''},
	bio: {type:String, trim:true, default:''},
	isConfirmed: {type:String, trim:true, default:'pending'}, // yes, no, pending
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:process.env.DEFAULT_PROFILE_IMAGE},
	email: {type:String, trim:true, lowercase:true, default:''},
	credits: {type:Number, default:0}, // first 3 are free
	password: {type:String, trim:true, default:''},
	social: {type:mongoose.Schema.Types.Mixed, default:{}},
	viewed: {type:mongoose.Schema.Types.Mixed, default:{}}, // map of profiles that viewed the post
	timestamp: {type:Date, default:Date.now}
})

ProfileSchema.methods.summary = function(){
	var summary = {
		username: this.username,
		bio: this.bio,
		isConfirmed: this.isConfirmed,
		slug: this.slug,
		image: this.image,
		email: this.email,
		credits: this.credits,
		social: this.social,
		viewed: this.viewed,
		timestamp: this.timestamp,
		schema: 'profile',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('ProfileSchema', ProfileSchema)