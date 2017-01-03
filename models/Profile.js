var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	username: {type:String, trim:true, default:''},
	title: {type:String, trim:true, default:''}, // web developer, designer, photographer, etc
	bio: {type:String, trim:true, default:''},
	isConfirmed: {type:String, trim:true, default:'pending'}, // yes, no, pending
	slug: {type:String, trim:true, lowercase:true, unique:true, default:''},
	image: {type:String, trim:true, default:process.env.DEFAULT_PROFILE_IMAGE},
	email: {type:String, trim:true, lowercase:true, default:''},
	credits: {type:Number, default:0},
	password: {type:String, trim:true, default:''},
	subscribers: {type:Array, default:[]},
	districts: {type:Array, default:[]},
	tags: {type:Array, default:[]},
	social: {type:mongoose.Schema.Types.Mixed, default:{}},
	viewed: {type:mongoose.Schema.Types.Mixed, default:{}}, // map of profiles that viewed the post
	timestamp: {type:Date, default:Date.now}
})

ProfileSchema.methods.summary = function(){
	var summary = {
		username: this.username,
		title: this.title,
		bio: this.bio,
		isConfirmed: this.isConfirmed,
		slug: this.slug,
		image: this.image,
		email: this.email,
		credits: this.credits,
		subscribers: this.subscribers,
		districts: this.districts,
		tags: this.tags,
		social: this.social,
		viewed: this.viewed,
		timestamp: this.timestamp,
		schema: 'profile',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('ProfileSchema', ProfileSchema)