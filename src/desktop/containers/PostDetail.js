import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import actions from '../../actions/actions'
import constants from '../../constants/constants'
import { CreateComment, CreatePost, Comment, ProfilePreview } from '../view'
import { DateUtils, FirebaseManager, TextUtils } from '../../utils'
import styles from './styles'
import { Link } from 'react-router'

class PostDetail extends Component {
	constructor(){
		super()
		this.submitComment = this.submitComment.bind(this)
		this.state = {
			timestamp: null,
			selected: 'overview',
			isEditing: false,
			comments: null,
			comment: {
				text: ''
			},
			updatedPost: {
				changed: false
			},
			menuItems: [
				'Overview',
				'Chat'
			]
		}
	}

	componentWillMount(){
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		let selected = this.props.query['selected']
		if (selected != null){
			this.setState({
				selected: selected
			})
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		if (this.state.comments == null){
			this.props.fetchComments({'thread.id':post.id})
			.then(results => {
//				console.log('FETCH COMMENTS: '+JSON.stringify(results))
				this.setState({
					comments: results
				})

				return results
			})
			.then(results => {
				const author = this.props.profiles[post.author.slug]
				if (author == null)
					return this.props.fetchProfile(post.author.id)
			})
			.catch(err => {
				console.log('ERROR: '+JSON.stringify(err))

			})
		}



		// sloppy workaround, render timestamp client side:
		this.setState({timestamp: DateUtils.formattedDate(post.timestamp)})

		// FirebaseManager.register('/'+post.id+'/comments', (err, currentComments) => {
		// 	if (err){
		// 		return
		// 	}

		// 	this.setState({
		// 		comments: currentComments.reverse()
		// 	})
		// })

		// // Track view count:
		// const userId = (this.props.user == null) ? 'unregistered' : this.props.user.id
		// let updatedViewed = Object.assign({}, post.viewed)
		// updatedViewed[userId] = (updatedViewed[userId] == null) ? 1 : updatedViewed[userId]+1
		// let total = 0
		// Object.keys(updatedViewed).forEach((key, i) => {
		// 	if (key != 'total')
		// 		total += updatedViewed[key]
		// })

		// updatedViewed['total'] = total
		// this.props.updatePost(post, {viewed: updatedViewed})
	}

	componentDidUpdate(){
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		const author = this.props.profiles[post.author.slug]
		if (author == null)
			return

		const teams = this.props.teams[post.author.id] // can be null
		if (teams == null){
			this.props.fetchTeams({'members.id': post.author.id})
			return
		}
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)
		this.setState({
			selected: (event.target.id == 'select') ? event.target.value : item
		})
	}

	// submitComment(comment){
// 		if (this.props.user == null){
// 			alert('Please log in or register to post a comment.')
// 			return
// 		}

		// const post = this.props.posts[this.props.slug]
		// if (post == null)
		// 	return

		// let updated = Object.assign({}, comment)
// 		updated['timestamp'] = new Date().getTime()
// 		updated['profile'] = {
// 			id: this.props.user.id,
// 			username: this.props.user.username,
// 			image: this.props.user.image
// 		}

// 		const currentDistrict = this.props.session.currentDistrict
// 		const path = '/'+post.id+'/comments/'+this.state.comments.length
// 		FirebaseManager.post(path, updated, () => {
// 			this.props.updatePost(post, {numComments: this.state.comments.length})
// //			console.log('callback test') // TODO: post comment to API
// 		})
// 	}

	updateComment(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.comment)
		updated[event.target.id] = event.target.value
		this.setState({
			comment: updated,
		})
	}

	enterKeyPressed(event){
		if (event.charCode != 13)
			return

		this.submitComment(null)
	}

	submitComment(event){
		// if (event.charCode != 13)
		// 	return

		if (event != null)
			event.preventDefault()

		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		const user = this.props.user
		if (user == null)
			return

		let updated = Object.assign({}, this.state.comment)
		updated['thread'] = {
			id: post.id,
			schema: post.schema,
			subject: post.title,
			image: post.image
		}

		updated['profile'] = {
			id: user.id,
			username: user.username,
			slug: user.slug,
			image: user.image
		}

		this.props.createComment(updated)
		.then(response => {
//			console.log('Comment Created: '+JSON.stringify(response.result))
			let updated = Object.assign([], this.state.comments)
			updated.push(response.result)
			this.setState({
				comments: updated,
				comment: {
					text: ''
				}
			})

		})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
		})
	}

	toggleEditing(){
		this.setState({
			isEditing: !this.state.isEditing
		})
	}

	updatePost(post){
//		console.log('UPDATE POST: '+JSON.stringify(post))
		if (this.state.isEditing == false)
			return

		let updated = Object.assign({}, post)
		const original = this.props.posts[this.props.slug]
		this.props.updatePost(original, updated)
		.then(response => {
			this.setState({
				isEditing: !this.state.isEditing
			})
		})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
		})
	}

	render(){
		const style = styles.post
		const user = this.props.user // can be null
		const post = this.props.posts[this.props.slug]
		const author = this.props.profiles[post.author.slug]

		const selected = this.state.selected.toLowerCase()

		// const sideMenu = this.state.menuItems.map((item, i) => {
		// 	return (
		// 		<li key={i}>
		// 			<div style={ (item.toLowerCase() == selected) ? styles.account.selected : styles.account.menuItem }>
		// 				<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
		// 			</div>
		// 		</li>
		// 	)
		// })

		let content = null
		const btn = 'button button-mini button-circle '
		const btnRedClass = btn + 'button-red'
		const btnGreenClass = btn + 'button-green'
		const btnBlueClass = btn + 'button-blue'

		if (this.state.isEditing == true)
			content = <CreatePost submit={this.updatePost.bind(this)} cancel={this.toggleEditing.bind(this)} post={post} />		
		else if (selected == 'overview'){
			let btnEdit = null
			if (user != null){
				if (user.id == post.author.id)
					btnEdit = <button onClick={this.toggleEditing.bind(this)} className={btnBlueClass} style={{float:'right'}}>Edit</button>
			}

			content = (
				<div>
					<div className="hidden-xs" style={{lineHeight:18+'px', textAlign:'right'}}>
						<img style={{float:'right', marginLeft:10, borderRadius:18}} src={post.author.image+'=s36-c'} />
						<span><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span><br />
						<span style={{fontWeight:100, fontSize:11}}>{ this.state.timestamp }</span><br />
					</div>

					<div style={{textAlign:'left', padding:24}}>
						{ btnEdit }
						<h2 style={styles.team.title}>
							{ (post.url.length == 0) ? post.title : <a target='_blank' style={style.title} href={post.url}>{post.title }</a> }
						</h2>
						<hr />
						{ ( post.image.length == 0) ? null : (
								<div>
									<img className="hidden-xs" style={{padding:3, border:'1px solid #ddd', background:'#fff', float:'right', marginLeft:12}} src={(post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s240'} />
									<img className="visible-xs" style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={(post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s240'} />
								</div>
							)
						}

						<div style={{textAlign:'left', marginTop:24}}>
							<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(post.text)}}></p>
						</div>
						<hr />
					</div>					
				</div>
			)
		}
		// else if (selected == 'chat'){ // chat
		// 	content = (
		// 		<div style={{overflowY:'scroll', borderRight:'1px solid #ddd', borderLeft:'1px solid #ddd', borderBottom:'1px solid #ddd'}}>
		// 			<CreateComment onCreate={this.submitComment.bind(this)} />
		// 			{
		// 				this.state.comments.map((comment, i) => {
		// 					return <Comment comment={comment} key={i} />
		// 				})
		// 			}
		// 		</div>
		// 	)
		// }

//		const feed = this.props.posts[post.teams[0]]
		const teams = this.props.teams[post.author.id] // can be null

		return (
			<div>
				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								<div style={{paddingTop:96}}>
									{ (author == null) ? null : 
										<div>
											<img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginTop:6}} src={author.image+'=s140'} />
											<h2 style={ style.title }>
												<Link to={'/profile/'+author.slug}>{ author.username }</Link>
											</h2>
											<span style={styles.paragraph}>{ author.title }</span><br />
											<span style={styles.paragraph}>{ TextUtils.capitalize(author.location.city) }</span>
											<br />
											<Link to={'/profile/'+author.slug}  href="#" className="button button-mini button-border button-border-thin button-blue" style={{marginLeft:0}}>View Profile</Link>
										</div>
									}

									<hr />
									<nav id="primary-menu">
										{ (teams == null) ? null : teams.map((team, i) => {
												return (
													<div key={team.id} style={{padding:'16px 16px 16px 0px'}}>
														<Link to={'/team/'+team.slug}>
															<img style={localStyle.image} src={team.image+'=s44-c'} />
														</Link>
														<Link style={localStyle.detailHeader} to={'/team/'+team.slug}>
															{team.name}
														</Link>
														<br />
														<span style={localStyle.subtext}>{ TextUtils.capitalize(team.type) }</span>
													</div>
												)
											})
										}
									</nav>
								</div>
				            </div>

			            </div>
					</header>

					<section id="content" style={{background:'#fff', minHeight:800}}>
						<div className="content-wrap container clearfix">
							<div className="col_two_third">
								<div className="feature-box center media-box fbox-bg">
									<div style={styles.main}>
										{ content }
									</div>
								</div>
							</div>


							<div className="col_one_third col_last">
								<div className="col_full panel panel-default">
									<div className="panel-heading">Comments</div>
									{ (this.state.comments == null) ? null : this.state.comments.map((comment, i) => {
											return <Comment key={comment.id} comment={comment} />
										})
									}

									<div>
										<input type="text" id="text" value={this.state.comment.text} onChange={this.updateComment.bind(this)} onKeyPress={this.enterKeyPressed.bind(this)} style={localStyle.input} placeholder="Enter Comment" />
									</div>
								</div>
							</div>

						</div>
					</section>
				</div>

				{ /* mobile UI */ }
				<div className="clearfix visible-xs">
					<div className="row" style={{background:'#f9f9f9', padding:12, borderBottom:'1px solid #ddd', lineHeight:10+'px'}}>
						<div className="col-xs-6">
							<h3 style={style.title}>{ TextUtils.capitalize(post.type) }</h3>
						</div>

						{ (author == null) ? null : 
							<div style={{textAlign:'right'}} className="col-xs-6">
								{ (author.image.length == 0) ? null : <img style={{float:'right', borderRadius:24, marginLeft:12}} src={author.image+'=s48-c'} /> }
								<Link to={'/profile/'+author.slug}>
									<h3 style={style.title}>{ author.username }</h3>
								</Link>
								<span style={styles.paragraph}>{ TextUtils.capitalize(author.location.city) }</span>
							</div>
						}
					</div>
					{ content }

					<div style={{padding:12, borderBottom:'1px solid #ddd'}}>
						<h3 style={style.title}>Comments</h3>
					</div>
					{ (this.state.comments == null) ? null : this.state.comments.map((comment, i) => {
							return <Comment key={comment.id} comment={comment} />
						})
					}

					<div>
						<input type="text" id="text" value={this.state.comment.text} onChange={this.updateComment.bind(this)} style={localStyle.input} placeholder="Enter Comment" />
						<br />
						<a href="#" style={{float:'right', marginTop:12}} onClick={this.submitComment.bind(this)} className="button button-small button-circle button-green">Submit Comment</a>
					</div>


				</div>
				{ /* end mobile UI */ }

			</div>
		)
	}
}

const localStyle = {
	select: {
		color: '#333',
		background: '#fff',
		padding: 6,
		fontWeight: 100,
	    fontSize: 20,
		width: 100+'%',
		marginTop: 6,
		marginLeft: 16,
		fontFamily: 'Pathway Gothic One',
		border: 'none'
	},
	input: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 0,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	detailHeader: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		fontSize: 18,
		lineHeight: 10+'px'
	},
	image: {
		float:'left',
		marginRight:12,
		borderRadius:22,
		width:44
	},
	subtext: {
		fontWeight:100,
		fontSize:14,
		lineHeight:14+'px'
	},
	btnGreen: {
		className: 'button button-small button-circle button-green',
		marginBottom: 12,
		width: 100+'%'
	},	
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		session: state.session,
		posts: state.post,
		teams: state.team,
		profiles: state.profile
	}
}

const dispatchToProps = (dispatch) => {
	return {
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		fetchProfile: (id) => dispatch(actions.fetchProfile(id)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		fetchComments: (params) => dispatch(actions.fetchComments(params)),
		createComment: (comment) => dispatch(actions.createComment(comment))
	}

}

export default connect(stateToProps, dispatchToProps)(PostDetail)
