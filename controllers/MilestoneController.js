var Milestone = require('../models/Milestone')
var ProfileController = require('./ProfileController')
var utils = require('../utils')
var Promise = require('bluebird')
var fs = require('fs')

var fetchFile = function(path){
	return new Promise(function (resolve, reject){
		fs.readFile(path, 'utf8', function (err, data) {
			if (err) {reject(err) }
			else { resolve(data) }
		})
	})
}

module.exports = {
	get: function(params, isRaw){
		return new Promise(function(resolve, reject){
			var sortOrder = (params.sort == 'asc') ? 1 : -1
			delete params['sort']

			/* Query by filters passed into parameter string: */
			var limit = params.limit
			if (limit == null)
				limit = '0'
			
			delete params['limit']


			if (params['project.id']){
				var parts = params['project.id'].split(',') // array of team ids
				var array = []
				parts.forEach(function(projectId, i){
					array.push({
						'project.id': projectId
					})
				})

				params = {$or: array}
				delete params['project.id']
			}

			if (params['teams']){
				var parts = params['teams'].split(',') // array of team ids
				var array = []
				parts.forEach(function(teamId, i){
					array.push({
						'teams': teamId
					})
				})

				params = {$or: array}
				delete params['teams']
			}


			Milestone.find(params, null, {limit:parseInt(limit), sort:{timestamp: sortOrder}}, function(err, milestones){
				if (err){
					reject(err)
					return
				}

				if (isRaw == true){
					resolve(milestones)
					return
				}

				resolve(utils.Resource.convertToJson(milestones))
			})
		})
	},

	getById: function(id){
		return new Promise(function(resolve, reject){
			Milestone.findById(id, function(err, milestone){
				if (err){
					reject(err)
					return
				}

				resolve(milestone.summary())
			})
		})
	},

	post: function(params){
		return new Promise(function(resolve, reject){
			if (params.title != null)
				params['slug'] = utils.TextUtils.slugVersion(params.title)+'-'+utils.TextUtils.randomString(6)

			Milestone.create(params, function(err, milestone){
				if (err){
					reject(err)
					return
				}

				// notify all profiles on the project:
				var path = 'public/email/notification/milestone.html'
				var html = null
				fetchFile(path)
				.then(function(data){
					html = data.replace('{{ title }}', milestone.title)
					html = html.replace('{{ from }}', milestone.profile.username)
					html = html.replace('{{ project }}', milestone.project.title)
					html = html.replace('{{ image }}', milestone.project.image)
					html = html.replace('{{ slug }}', milestone.project.slug)
//					return ProfileController.get({projects: milestone.project.id}, false)
					return ProfileController.getById(project.author.id)
				})
				.then(function(profile){
					var subject = milestone.title
					utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, profile.email, 'New Project Activity: '+subject, html)
				})
				.catch(function(err){

				})

				resolve(milestone.summary())
			})	
		})
	},

	put: function(id, params){
		return new Promise(function(resolve, reject){
			Milestone.findByIdAndUpdate(id, params, {new:true}, function(err, milestone){
				if (err){
					reject(err)
					return
				}

				resolve(milestone.summary())
			})
		})
	},

	delete: function(id){
		return new Promise(function(resolve, reject){
			Milestone.findByIdAndRemove(id, function (err){
			    if (err) { 
					reject(err)
					return
			    }

			    resolve()
			})
		})
	}
}

