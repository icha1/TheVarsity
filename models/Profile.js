var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	username: {type:String, trim:true, default:''},
	title: {type:String, trim:true, default:''}, // web developer, designer, photographer, etc
	bio: {type:String, trim:true, default:''},
	isConfirmed: {type:String, trim:true, default:'pending'}, // yes, no, pending
	type: {type:String, trim:true, default:'standard'}, // standard or admin (so far, maybe premium later)
	slug: {type:String, trim:true, lowercase:true, unique:true, default:''},
	image: {type:String, trim:true, default:process.env.DEFAULT_PROFILE_IMAGE},
	email: {type:String, trim:true, lowercase:true, default:''},
	credits: {type:Number, default:0},
	password: {type:String, trim:true, default:''},
	subscribers: {type:Array, default:[]},
	teams: {type:Array, default:[]},
	districts: {type:Array, default:[]},
	tags: {type:Array, default:[]},
	badge: {type:mongoose.Schema.Types.Mixed, default:{}},
	location: {type:mongoose.Schema.Types.Mixed, default:{}},
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
		type: this.type,
		slug: this.slug,
		image: this.image,
		email: this.email,
		credits: this.credits,
		teams: this.teams,
		tags: this.tags,
		badge: this.badge,
		location: this.location,
		timestamp: this.timestamp,
		schema: 'profile',
		id: this._id.toString()

		// subscribers: this.subscribers,
		// districts: this.districts,
		// social: this.social,
		// viewed: this.viewed,		
	}

	return summary
}

module.exports = mongoose.model('ProfileSchema', ProfileSchema)