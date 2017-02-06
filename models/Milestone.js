var mongoose = require('mongoose')

var MilestoneSchema = new mongoose.Schema({
	project: {type:mongoose.Schema.Types.Mixed, default:{}},
	profile: {type:mongoose.Schema.Types.Mixed, default:{}},
	title: {type:String, trim:true, default:''},
	slug: {type:String, trim:true, lowercase:true, default:''},
	image: {type:String, trim:true, default:''},
	description: {type:String, trim:true, default:''},
	comments: {type:Array, default:[]},
	teams: {type:Array, default:[]},
	attachments: {type:Array, default:[]},
	timestamp: {type:Date, default:Date.now}
})

MilestoneSchema.methods.summary = function(){
	var summary = {
		project: this.project,
		profile: this.profile,
		title: this.title,
		slug: this.slug,
		image: this.image,
		description: this.description,
		teams: this.teams,
		comments: this.comments,
		attachments: this.attachments,
		timestamp: this.timestamp,
		schema: 'milestone',
		id: this._id.toString()
	}

	return summary
}

module.exports = mongoose.model('MilestoneSchema', MilestoneSchema)