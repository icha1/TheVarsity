var mongoose = require('mongoose')

var TeamSchema = new mongoose.Schema({
	name: {type:String, trim:true, default:''},
	type: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:''},
	district: {type:String, trim:true, default:''},
	description: {type:String, trim:true, default:''},
	social: {type:mongoose.Schema.Types.Mixed, default:{}},
	address: {type:mongoose.Schema.Types.Mixed, default:{}}, // city, state, zip
	geo: {
		type: [Number], // array of Numbers
		index: '2d'
	},
	timestamp: {type:Date, default:Date.now}
})

TeamSchema.methods.summary = function(){
	var summary = {
		name: this.name,
		type: this.type,
		slug: this.slug,
		image: this.image,
		district: this.district,
		description: this.description,
		social: this.social,
		address: this.address,
		geo: this.geo,
		timestamp: this.timestamp,
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('TeamSchema', TeamSchema)