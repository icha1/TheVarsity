var mongoose = require('mongoose')

var TeamSchema = new mongoose.Schema({
	name: {type:String, trim:true, default:''},
	members: {type:Array, default:[]},
	invited: {type:Array, default:[]},
	type: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:''},
	images: {type:Array, default:[]},
	district: {type:String, trim:true, default:''},
	description: {type:String, trim:true, default:''},
	subscribers: {type:Array, default:[]},
	social: {type:mongoose.Schema.Types.Mixed, default:{}},
	address: {type:mongoose.Schema.Types.Mixed, default:{}}, // street, city, state, zip
	viewed: {type:mongoose.Schema.Types.Mixed, default:{}}, // map of profiles that viewed the post
	geo: {
		type: [Number], // array of Numbers
		index: '2d'
	},
	timestamp: {type:Date, default:Date.now}
})

TeamSchema.methods.summary = function(){
	var summary = {
		name: this.name,
		members: this.members,
		invited: this.invited,
		type: this.type,
		slug: this.slug,
		image: this.image,
		images: this.images,
		district: this.district,
		description: this.description,
		subscribers: this.subscribers,
		social: this.social,
		address: this.address,
		viewed: this.viewed,
		geo: this.geo,
		timestamp: this.timestamp,
		schema: 'team',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('TeamSchema', TeamSchema)