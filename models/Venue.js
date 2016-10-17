var mongoose = require('mongoose')

var VenueSchema = new mongoose.Schema({
	name: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:''},
	description: {type:String, trim:true, default:''},
	social: {type:mongoose.Schema.Types.Mixed, default:{}},
	address: {type:mongoose.Schema.Types.Mixed, default:{}}, // city, state, zip
	geo: {
		type: [Number], // array of Numbers
		index: '2d'
	},
	timestamp: {type:Date, default:Date.now}
})

VenueSchema.methods.summary = function(){
	var summary = {
		name: this.name,
		slug: this.slug,
		image: this.image,
		description: this.description,
		social: this.social,
		address: this.address,
		geo: this.geo,
		timestamp: this.timestamp,
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('VenueSchema', VenueSchema)