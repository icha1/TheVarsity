var mongoose = require('mongoose')

var DistrictSchema = new mongoose.Schema({
	name: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:''},
	description: {type:String, trim:true, default:''},
	city: {type:String, trim:true, lowercase:true, default:''},
	state: {type:String, trim:true, lowercase:true, default:''},
	zips: {type:Array, trim:true, default:[]}, // inluded zip codes
	geo: {
		type: [Number], // array of Numbers
		index: '2d'
	},
	timestamp: {type:Date, default:Date.now}
})

DistrictSchema.methods.summary = function(){
	var summary = {
		name: this.name,
		slug: this.slug,
		image: this.image,
		description: this.description,
		city: this.city,
		state: this.state,
		zips: this.zips,
		geo: this.geo,
		timestamp: this.timestamp,
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('DistrictSchema', DistrictSchema)