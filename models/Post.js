var mongoose = require('mongoose')

var PostSchema = new mongoose.Schema({
	title: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	url: {type:String, trim:true, default:''}, // for news posts
	code: {type:String, trim:true, default:''}, // this is a unique identifier from instagram
	image: {type:String, trim:true, default:''},
	video: {type:String, trim:true, default:''},
	text: {type:String, trim:true, default:''},
	type: {type:String, trim:true, default:'event'}, // event, news
	district: {type:String, trim:true, default:''},
	saved: {type:Array, default:[]}, // array of profile IDs who saved the post
	numComments: {type:Number, default:0},
	viewed: {type:mongoose.Schema.Types.Mixed, default:{}}, // map of profiles that viewed the post
	author: {type:mongoose.Schema.Types.Mixed, default:{}}, // can be team or profile.
	eventDetails: {type:mongoose.Schema.Types.Mixed, default:{}}, // date, rsvp list, status, etc. If not event, this will be empty
	geo: {
		type: [Number], // array of Numbers
		index: '2d'
	},
	timestamp: {type:Date, default:Date.now}
})

PostSchema.methods.summary = function(){
	var summary = {
		title: this.title,
		slug: this.slug,
		url: this.url,
		code: this.code,
		image: this.image,
		video: this.video,
		text: this.text,
		type: this.type,
		district: this.district,
		saved: this.saved,
		numComments: this.numComments,
		viewed: this.viewed,
		author: this.author,
		eventDetails: this.eventDetails,
		geo: this.geo,
		timestamp: this.timestamp,
		schema: 'post',
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('PostSchema', PostSchema)