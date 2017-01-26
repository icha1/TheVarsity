var mongoose = require('mongoose')

var MilestoneSchema = new mongoose.Schema({
	title: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:''},
	description: {type:String, trim:true, default:''},
	timestamp: {type:Date, default:Date.now}
})

MilestoneSchema.methods.summary = function(){
	var summary = {
		title: this.title,
		slug: this.slug,
		image: this.image,
		description: this.description,
		timestamp: this.timestamp,
		schema: 'milestone',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('MilestoneSchema', MilestoneSchema)