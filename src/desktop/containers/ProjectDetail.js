import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import actions from '../../actions/actions'
import constants from '../../constants/constants'
import { CreateComment, CreatePost, Comments, ProfilePreview, Application } from '../view'
import { DateUtils, FirebaseManager, TextUtils, APIManager, Alert } from '../../utils'
import styles from './styles'
import { Link } from 'react-router'
import Section from './Section'

class ProjectDetail extends Component {
	constructor(){
		super()
		this.state = {
			timestamp: null,
			isEditing: false,
			comments: null,
			selected: 'Post',
			menuItems: ['Post', 'Comments']			
		}
	}

	componentWillMount(){
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		if (post.type == 'hiring')
			this.setState({
				menuItems: ['Post', 'Apply']
			})
	}

	componentDidMount(){
		console.log('componentDidMount: '+this.props.slug)
		window.scrollTo(0, 0)
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		if (this.state.comments == null){
			this.props.fetchComments({'thread.id':post.id})
			.then(results => {
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
	}

	componentDidUpdate(){
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		const author = this.props.profiles[post.author.slug]
		if (author == null)
			return

		const team = this.props.teams[post.teams[0]]
		if (team == null){
			this.props.fetchTeam(post.teams[0])
			return			
		}
	}

	selectItem(item, event){
		event.preventDefault()

		const selected = (item.length == 0) ? event.target.value : item
		console.log('selectItem: '+selected)

		if (selected == 'Apply'){
			if (this.props.user == null){ // have to be logged in
				document.getElementById('request').scrollIntoView()

				Alert.showAlert({
					title: 'Log In',
					text: 'Please log in or sign up to apply to this post.'
				})
				return
			}
		}

		window.scrollTo(0, 0)
		this.setState({
			selected: selected
		})
	}

	updateComment(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.comment)
		updated[event.target.id] = event.target.value
		this.setState({
			comment: updated,
		})
	}

	submitComment(event){
		if (event.charCode != 13)
			return

		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		const user = this.props.user
		if (user == null)
			return

		let comment = {text: event.target.value}
		comment['thread'] = {
			id: post.id,
			schema: post.schema,
			subject: post.title,
			image: post.image
		}

		comment['profile'] = {
			id: user.id,
			username: user.username,
			slug: user.slug,
			image: user.image
		}

		event.persist()
		this.props.createComment(comment)
		.then(response => {
			let updated = Object.assign([], this.state.comments)
			event.target.value = ''
			updated.push(response.result)
			this.setState({
				comments: updated
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

	submitApplication(application){
		const post = this.props.posts[this.props.slug]
		application['post'] = {
			id: post.id,
			title: post.title,
			author: post.author.id,
			slug: post.slug
		}

		application['recipients'] = post.contact

		this.props.applyToJob(application)
		.then(response => {
			this.setState({selected: 'Post'})
			Alert.showConfirmation({
				title: 'Application Submitted',
				text: 'Your application was successfully submitted. Good Luck!'
			})
		})
		.catch(err => {
			console.log('ERROR: '+JSON.stringify(err))
			Alert.showAlert({
				title: 'Error',
				text: err.message
			})
		})
	}

	render(){
		const style = styles.post
		const user = this.props.user // can be null
		const post = this.props.posts[this.props.slug]
		const author = (post == null) ? null : this.props.profiles[post.author.slug]

		let content = null
		const btn = 'button button-mini button-circle '
		const btnBlueClass = btn + 'button-blue'

		const selected = this.state.selected

		if (this.state.isEditing == true)
			content = <CreatePost submit={this.updatePost.bind(this)} cancel={this.toggleEditing.bind(this)} post={post} />		
		else if (selected == 'Post'){
			let btnEdit = null
			if (user != null){
				if (user.id == post.author.id)
					btnEdit = <button onClick={this.toggleEditing.bind(this)} className={btnBlueClass} style={{float:'right'}}>Edit</button>
			}

			content = (
				<div>
					<div className="hidden-xs" style={{lineHeight:18+'px'}}>
						{ btnEdit }
						<img style={{marginRight:10, borderRadius:22, float:'left'}} src={post.author.image+'=s44-c'} />
						<span><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span><br />
						<span style={{fontWeight:100, fontSize:11}}>{ this.state.timestamp }</span><br />
					</div>

					<div style={{textAlign:'left', marginTop:24, minHeight:300}}>
						{ ( post.image.length == 0) ? null : (
								<div>
									<img className="hidden-xs" style={{padding:3, border:'1px solid #ddd', background:'#fff', float:'right', marginLeft:12}} src={(post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s240'} />
									<img className="visible-xs" style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={(post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s240'} />
								</div>
							)
						}
						<p className="lead" style={{fontSize:16, color:'#555', marginBottom:12}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(post.text)}}></p>
						{ (post.url.length == 0) ? null : <a target="_blank" style={{color:'red'}} href={post.url}>READ MORE</a> }
					</div>
					
					{ (post.images.length==0) ? null : <div><hr /><h3 style={styles.title}>Additional Images</h3></div> } 
					{ post.images.map((image, i) => {
							return (
								<a key={i} target="_blank" href={image}>
									<img style={{marginRight:12, background:'#fff', padding:3, border:'1px solid #ddd'}} src={image+'=s64-c'} />
								</a>
							)
						})
					}

					{ (post.type == 'hiring') ? <div><hr /><button onClick={this.selectItem.bind(this, 'Apply')} className="button button-mini button-border button-border-thin button-blue">Apply To This Job</button></div> : null	}
				</div>
			)
		}
		else if (selected == 'Comments'){
			content = (
				<Comments 
					user={user}
					comments={this.state.comments}
					submitComment={this.submitComment.bind(this)} />
			)
		}
		else if (selected == 'Apply'){
			const userPosts = this.props.posts[user.id]
			if (userPosts == null){ // fetch showcase projects
				this.props.fetchPosts({'author.id': user.id})
				.then(response => {
//					console.log(JSON.stringify(response))
				})
				.catch(err => {
					console.log(err)
				})
			}

			const projects = (userPosts == null) ? [] : userPosts.filter((userPost, i) => {
				return (userPost.type == 'showcase')
			})

			content = <Application user={user} projects={projects} onSubmitApplication={this.submitApplication.bind(this)} />
		}

		const team = (this.props.session.currentTeam) ? this.props.session.currentTeam : this.props.teams[post.teams[0]]
		return (
			<div>

				<div className="clearfix hidden-xs">
					<header id="header" className="no-sticky" style={{background:'#f9f9f9'}}>
			            <div id="header-wrap">
							<div className="container clearfix">
								<div style={{paddingTop:96}}>
									{ (team == null) ? null : 
										<div>
											<Link to={'/team/'+team.slug}>
												<img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginTop:6}} src={team.image+'=s140-c'} />
												<h2 style={ style.title }>{ team.name }</h2>
											</Link>
											<span style={styles.paragraph}>{ TextUtils.capitalize(team.type) }</span><br />
											<br />
											<Link to={'/team/'+team.slug}  href="#" className="button button-mini button-border button-border-thin button-blue" style={{marginLeft:0}}>View Team</Link>
										</div>
									}
									<hr />

									<nav>
										<ul style={{listStyleType:'none'}}>
											{ this.state.menuItems.map((item, i) => {
													const itemStyle = (item == this.state.selected) ? localStyle.selected : localStyle.menuItem
													return (
														<li style={{marginTop:0}} key={item}>
															<div style={itemStyle}>
																<a onClick={this.selectItem.bind(this, item)} href="#"><div>{item}</div></a>
															</div>
														</li>
													)
												})
											}
										</ul>
									</nav>

								</div>
				            </div>
			            </div>
					</header>

					<section id="content" style={{background:'#fff', minHeight:800}}>
						<div className="content-wrap container clearfix">


					<div className="postcontent nobottommargin col_last clearfix">
						<div id="posts" className="post-timeline clearfix">
							<div className="timeline-border"></div>

							<div className="entry clearfix" style={{border:'none', paddingBottom:0}}>
								<div className="entry-timeline">
									1<span>Start</span>
									<div className="timeline-divider"></div>
								</div>
								<div className="entry-image">
									<a href={post.image} data-lightbox="image">
										<img style={{maxWidth:420, border:'1px solid #ddd', background:'#fff', padding:6}} className="image_fade" src={post.image} alt="Standard Post with Image" />
									</a>
								</div>

								<ul className="entry-meta clearfix">
									{ post.images.forEach((image, i) => {
											<li style={{color:'#fff'}}>
												<a href={image} data-lightbox="image">
													<img src={image+'=s72-c'} />
												</a>
											</li>
										})
									}
								</ul>

								<div className="clearfix"></div>
								<div className="entry-title clearfix">
									<h2 style={styles.team.title}>{post.title}</h2>
								</div>

								<hr />
								<div className="hidden-xs" style={{lineHeight:18+'px'}}>
									<img style={{marginRight:10, borderRadius:22, float:'left'}} src={post.author.image+'=s44-c'} />
									<span><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span><br />
									<span style={{fontWeight:100, fontSize:11}}>{ this.state.timestamp }</span><br />
								</div>

								<div className="entry-content" style={{marginTop:24}}>
									<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(post.text)}}></p>
								</div>
							</div>

							<div className="entry clearfix" style={{border:'none'}}>
								<div className="entry-timeline">
									21<span>Mar</span>
									<div className="timeline-divider"></div>
								</div>
								<div className="entry-image">
									<div className="panel panel-default">
										<div className="panel-body">
											Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia, fuga optio voluptatibus saepe tenetur aliquam debitis eos accusantium! Vitae, hic, atque aliquid repellendus accusantium laudantium minus eaque quibusdam ratione sapiente.
										</div>
									</div>
								</div>
							</div>


						</div>
					</div>

						</div>
					</section>



					<section id="content" style={{background:'#fff', minHeight:800}}>
						<div className="content-wrap container clearfix">

							<div className="col_two_third">
								<div className="feature-box center media-box fbox-bg">
									<div style={styles.main}>
										<h2 style={styles.team.title}>
											{ (post.url.length == 0) ? post.title : <a target='_blank' style={style.title} href={post.url}>{post.title }</a> }
										</h2>

										<hr />
										{ content }
									</div>
								</div>

							</div>

							<div className="col_one_third col_last">

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

					<div style={{padding:'0px 16px 16px 16px'}}>
						{ content }
					</div>

					{ (post.type == 'hiring') ? null : 
						<div style={{paddingBottom:24, background:'#f9f9f9', textAlign:'right'}}>
							<input type="text" id="text" onChange={this.updateComment.bind(this)} style={localStyle.input} placeholder="Enter Comment" />
							<br />
							<a href="#" onClick={this.submitComment.bind(this)} style={{marginTop:12, marginRight:16}} className="button button-mini button-circle button-green">Submit Comment</a>
						</div>
					}
				</div>
				{ /* end mobile UI */ }

			</div>
		)
	}
}

const localStyle = {
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
	icon: {
		fontSize: 20,
		marginLeft: 4
	},
	iconContainer: {
		width:46,
		height:46,
		borderRadius:23,
		border:'1px solid #ddd',
		textAlign:'center',
		marginTop: 16
	},
	menuItem: {
		padding: '6px 6px 6px 16px',
		background: '#f9f9f9',
		borderLeft: '3px solid #ddd',
		fontSize: 16,
		fontWeight: 100
	},
	selected: {
		padding: '6px 6px 6px 16px',
		background: '#fff',
		borderRadius: 2,
		borderLeft: '3px solid rgb(91, 192, 222)',
		fontSize: 16,
		fontWeight: 400
	},
	titleWhite: {
		color:'#fff',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100
	},
	paragraphWhite: {
		fontWeight: 100,
		fontSize: 18,
		color:'#fff'
	},
	projectImage: {
		background: '#fff',
		padding: 3,
		border:'1px solid #ddd'
	},
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		posts: state.post,
		teams: state.team,
		profiles: state.profile,
		session: state.session
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchPostById: (id) => dispatch(actions.fetchPostById(id)),
		fetchPosts: (params) => dispatch(actions.fetchPosts(params)),
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		fetchProfile: (id) => dispatch(actions.fetchProfile(id)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params)),
		fetchTeam: (id) => dispatch(actions.fetchTeam(id)),
		fetchComments: (params) => dispatch(actions.fetchComments(params)),
		createComment: (comment) => dispatch(actions.createComment(comment)),
		applyToJob: (application) => dispatch(actions.applyToJob(application))
	}

}

export default connect(stateToProps, dispatchToProps)(ProjectDetail)
