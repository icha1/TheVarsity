var express = require('express')
var router = express.Router()
var ProfileController = require('../controllers/ProfileController')
var controllers = require('../controllers')
var bcrypt = require('bcryptjs')
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

router.get('/:action', function(req, res, next){
	var action = req.params.action

	if (action == 'email'){
//		var path = 'public/email/templates/product_announcement/product-announcement.html'
		var path = 'public/email/templates/newsletter/newsletter.html'
		fetchFile(path)
		.then(function(data){
				utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'The Varsity: New User', content)
		})
		.then(function(response){
			res.json({
				confirmation: 'success',
				response: response
			})

			return
		})
		.catch(function(err){
//			console.log('ERROR: '+err)
			res.json({
				confirmation: 'fail',
				message: err || err.message
			})
		})
	}

	if (action == 'unsubscribe'){
				utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'The Varsity: New User', content)
		.then(function(response){
			res.send('You have been unsubscribed.')
		})
		.catch(function(err){
			res.send('You have been unsubscribed.')
		})
	}

	if (action == 'logout'){
		req.session.reset()
		res.json({
			confirmation: 'success'
		})
	}

	if (action == 'currentuser'){ // check if user logged in
		if (req.session == null){
			res.json({
				confirmation: 'fail',
				message: 'User not logged in'
			})

			return
		}

		if (req.session.token == null){
			res.json({
				confirmation: 'fail',
				message: 'User not logged in'
			})

			return
		}

		utils.JWT.verify(req.session.token, process.env.TOKEN_SECRET)
		.then(function(decode){
			var userId = decode.id
			return ProfileController.getById(userId)
		})
		.then(function(profile){
			res.json({
				confirmation: 'success',
				user: profile
			})
		})
		.catch(function(err){
			res.json({
				confirmation: 'fail',
				message: err.message || err
			})
		})
	}
})

router.post('/:action', function(req, res, next){
	var action = req.params.action

	var token = null
	var p = null

	if (action == 'register'){
		ProfileController
		.get({email: req.body.email})
		.then(function(profiles){
			return (profiles == 0) ? ProfileController.post(req.body) : profiles[0]
		})
		.then(function(profile){
			p = profile
			token = utils.JWT.sign({id:profile.id}, process.env.TOKEN_SECRET, {expiresIn:4000})
			req.session.token = token

			utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'The Varsity: New User', profile.email+' just signed up.')
			return utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, profile.email, 'The Varsity', 'Welcome to the Varsity')
		})
		.then(function(response){
			res.json({
				confirmation: 'success',
				user: p,
				token: token
			})

			return response
		})
		.catch(function(err){
			console.log('TEST: '+err)
			res.json({
				confirmation:'fail',
				message: err.message || err
			})
		})
	}

	if (action == 'login'){
		var email = req.body.email

		ProfileController
		.get({email:email.toLowerCase()}, true)
		.then(function(profiles){
			if (profiles.length == 0){
				res.json({
					confirmation:'fail',
					message:'Profile not found. Check spelling.'
				})

				return
			}

			var profile = profiles[0]
			var password = req.body.password

			// Check password
			var passwordCorrect = bcrypt.compareSync(password, profile.password)
			if (passwordCorrect == false){
				res.json({
					confirmation:'fail',
					message:'Incorrect Password'
				})

				return				
			}

			var token = utils.JWT.sign({id:profile._id}, process.env.TOKEN_SECRET, {expiresIn:4000})
			req.session.token = token
			res.json({
				confirmation: 'success',
				user: profile.summary(),
				token: token
			})
		})
		.catch(function(err){
			res.json({
				confirmation:'fail',
				message: err.message || err
			})

			return
		})
	}

	if (action == 'feedback'){ // beta testing
		controllers.feedback
		.post(req.body)
		.then(function(result){
			res.json({
				confirmation: 'success',
				result: result
			})
		})
		.catch(function(err){
			var msg = err.errmsg || err.message || err
			res.json({
				confirmation: 'fail',
				message: msg
			})
		})
	}

	if (action == 'requestinvite'){
		var invitation = null
		controllers.invitation.post(req.body)
		.then(function(result){
			invitation = result
			return utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'The Varsity: Invitation Reqeust', JSON.stringify(result))
		})
		.then(function(result){
			res.json({
				confirmation: 'success',
				result: invitation
			})
		})
		.catch(function(err){
			var msg = err.errmsg || err.message || err
			res.json({
				confirmation: 'fail',
				message: msg
			})
		})
	}

	if (action == 'invite'){
		var invitation = null
		controllers.invitation.post(req.body)
		.then(function(result){
			invitation = result
			var context = (invitation.context == null) ? 'team' : invitation.context.type
			var path = 'public/email/invitation/'+context+'.html'
			return fetchFile(path)
		})
		.then(function(data){
			var context = (invitation.context == null) ? invitation.team : invitation.context

			var html = data.replace('{{team_image}}', context.image+'=s320-c')
			html = html.replace('{{from}}', invitation.from.email)
			html = html.replace('{{from}}', invitation.from.email)
			html = html.replace('{{team_name}}', context.name)
			html = html.replace('{{team_name}}', context.name)
			html = html.replace('{{email}}', invitation.email)
			html = html.replace('{{code}}', invitation.code)

			for (i=0; i<13; i++){ // shows up 13 times
				html = html.replace('{{invitation}}', invitation.id)
			}
			
			utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'Invitation: '+context.name+', TO: '+invitation.email, html) // send one to yourself
			utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, invitation.email, 'Invitation: '+context.name, html)
			return controllers.profile.get({email: invitation.email}, false)
		})
		.then(function(profiles){
			var data = {
				confirmation: 'success',
				invitation: invitation
			}

			if (profiles.length > 0)
				data['recipient'] = profiles[0]
			
			res.json(data)
		})
		.catch(function(err){
			var msg = err.errmsg || err.message || err
			res.json({
				confirmation: 'fail',
				message: msg
			})
		})
	}

	if (action == 'application'){ // applying to job
		var recipients = null
		var application = null

		controllers.application
		.post(req.body)
		.then(function(result){
			application = result
			recipients = application.recipients

			return controllers.profile.getById(application.post.author)
		})
		.then(function(author){
			recipients.push(author.email)
			recipients.push('dkwon@velocity360.io') // send copy to yourself
			// console.log('RECIPIENTS: '+JSON.stringify(recipients))

			var path = 'public/email/templates/application/application.html'
			return fetchFile(path)
		})
		.then(function(data){
			var html = data.replace('{{slug}}', application.slug)
			utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'Application: '+application.post.title, html)

			// application.recipients.forEach(function(email, i){
			// 	utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'The Varsity: Job Application', 'TEST')
			// })

			res.json({
				confirmation: 'success',
				result: application
			})
		})
		.catch(function(err){
			var msg = err.errmsg || err.message || err
			res.json({
				confirmation: 'fail',
				message: msg
			})
		})
	}

	if (action == 'redeem'){ // redeem invitation
		var invitation = null
		var host = null

		var params = {
			email: req.body.email.toLowerCase(),
			code: req.body.code
		}

		controllers.invitation
		.get(params, true)
		.then(function(invitations){ // should return only one
			if (invitations.length == 0)
				throw new Error('Invitation Not Found. Check the email or invitation code.')
			
			invitation = invitations[0]
			invitation['status'] = 'accepted'
			invitation.save()

			if (invitation.context.type == null)
				return controllers.team.getById(invitation.team.id, true)
			else 
				return controllers[invitation.context.type].getById(invitation.context.id, true)			
		})
		.then(function(entity){
			host = entity

			// create new profile, update team with new member:
			var profileParams = {
				password: invitation.code,
				email: invitation.email,
				username: invitation.name
			}

			return ProfileController.post(profileParams, true) // create new profile, return raw version
		})
		.then(function(profile){
			var type = (invitation.context.type == null) ? 'team' : invitation.context.type
			var changed = false

			if (type == 'team'){
				if (profile.teams.indexOf(host._id.toString()) == -1){
					var teamsArray = profile.teams
					teamsArray.push(host._id.toString())
					profile['teams'] = teamsArray
					profile.markModified('teams')

					var members = host.members
					members.push({
						id: profile.id,
						username: profile.username,
						image: profile.image,
						slug: profile.slug,
						title: profile.title
					})

					host['members'] = members
					host.markModified('members')
					changed = true
				}
			}

			if (type == 'project'){
				if (profile.projects.indexOf(host._id.toString()) == -1){
					var projectsArray = profile.projects
					projectsArray.push(host._id.toString())
					profile['projects'] = projectsArray
					profile.markModified('projects')

					var collaborators = host.collaborators
					collaborators.push({
						id: profile.id,
						username: profile.username,
						image: profile.image,
						slug: profile.slug,
						title: profile.title
					})

					host['collaborators'] = collaborators
					host.markModified('collaborators')

					// create corresponding milestone:
					controllers.milestone.post({
						title: profile.username+' joined a project!',
						description: profile.username+' joined the '+host.title+' project.',
						profile: {
							image: profile.image,
							slug: profile.slug,
							username: profile.username,
							id: profile.id
						},
						project: {
							image: host.image,
							slug: host.slug,
							title: host.title,
							id: host.id
						},
						teams: profile.teams
					})					

					changed = true
				}
			}

			if (changed == true){
				var content = profile.email+' just signed up for the Varsity.'
				utils.EmailUtils.sendEmail(process.env.DEFAULT_EMAIL, 'dkwon@velocity360.io', 'The Varsity: New User', content)

				host.save()
				profile.save()
			}

			var token = utils.JWT.sign({id:profile.id}, process.env.TOKEN_SECRET, {expiresIn:4000})
			req.session.token = token

			res.json({
				confirmation: 'success',
				type: (invitation.context) ? invitation.context.type : 'team',
				invitation: invitation.summary(),
				host: host.summary(),
				user: profile.summary(),
				token: token
			})
		})
		.catch(function(err){
			console.log('Account Router - Error: '+JSON.stringify(err))
			var msg = err.errmsg || err.message || err
			res.json({
				confirmation: 'fail',
				message: msg
			})
		})
	}

})

module.exports = router