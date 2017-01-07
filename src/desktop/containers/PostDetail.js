import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import actions from '../../actions/actions'
import constants from '../../constants/constants'
import { CreateComment, Comment, ProfilePreview } from '../view'
import { DateUtils, FirebaseManager, TextUtils } from '../../utils'
import styles from './styles'
import { Link } from 'react-router'

class PostDetail extends Component {
	constructor(){
		super()
		this.state = {
			timestamp: null,
			selected: 'overview',
			isEditing: false,
			comments: [],
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

		const author = this.props.profiles[post.author.slug]
		if (author == null)
			this.props.fetchProfile(post.author.id)

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
		if (teams == null)
			this.props.fetchTeams({'members.id': post.author.id})
	}

	selectItem(item, event){
		event.preventDefault()
		window.scrollTo(0, 0)

		this.setState({
			selected: item
		})
	}

	submitComment(comment){
		if (this.props.user == null){
			alert('Please log in or register to post a comment.')
			return
		}

		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		let updated = Object.assign({}, comment)
		updated['timestamp'] = new Date().getTime()
		updated['profile'] = {
			id: this.props.user.id,
			username: this.props.user.username,
			image: this.props.user.image
		}

		const currentDistrict = this.props.session.currentDistrict
		const path = '/'+post.id+'/comments/'+this.state.comments.length
		FirebaseManager.post(path, updated, () => {
			this.props.updatePost(post, {numComments: this.state.comments.length})
//			console.log('callback test') // TODO: post comment to API
		})
	}

	toggleEditing(){
		if (this.state.isEditing){
			// update post
			if (this.state.updatedPost.changed == true){
				const post = this.props.posts[this.props.slug]
				this.props.updatePost(post, this.state.updatedPost)
			}
		}

		this.setState({
			isEditing: !this.state.isEditing
		})
	}

	updatePost(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.updatedPost)
		updated[event.target.id] = event.target.value
		updated['changed'] = true
		this.setState({
			updatedPost: updated
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

		if (this.state.isEditing == true){
			const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
			const btnType = <a href="#" style={{marginLeft: 0}} className={btnClass}>{ post.type }</a>
			content = (
				<div style={{background:'#fff', padding:24, border:'1px solid #ddd', borderRadius:2}}>
					<div style={{lineHeight:18+'px', textAlign:'right'}}>
						<button className="button button-mini button-circle button-blue" onClick={this.toggleEditing.bind(this)} style={{float:'left', marginRight:12}}>Cancel</button>
						<button className="button button-mini button-circle button-green" onClick={this.toggleEditing.bind(this)} style={{float:'left'}}>Done</button>
					</div>

					<input id="title" onChange={this.updatePost.bind(this)} defaultValue={post.title} placeholder="Title" style={{marginTop:12, marginBottom:7, border:'none', fontSize:16, color:'#555', width:100+'%', background:'#f9f9f9', padding:6}}  />
						
					<hr style={{marginBottom:6}} />
					{ btnType }
					<textarea id="text" onChange={this.updatePost.bind(this)} style={{marginTop:16, border:'none', fontSize:16, color:'#555', width:100+'%', minHeight:180, background:'#f9f9f9', padding:6, resize:'none'}} defaultValue={post.text}></textarea>
					<img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={post.image} />
				</div>
			)
		}
		else if (selected == 'overview'){
			let btnEdit = null
			if (user != null){
				if (user.id == post.author.id)
					btnEdit = <button onClick={this.toggleEditing.bind(this)} className="button button-mini button-circle button-blue" style={{float:'right'}}>Edit</button>
			}

			const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
			content = (
				<div className="feature-box center media-box fbox-bg">
					<div style={{lineHeight:18+'px', textAlign:'right'}}>
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
						{ ( post.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff', float:'right', marginLeft:12}} src={(post.image.indexOf('googleusercontent') == -1) ? post.image : post.image+'=s240'} /> }
						<div style={{textAlign:'left', marginTop:24}}>
							<p className="lead" style={{fontSize:16, color:'#555'}} dangerouslySetInnerHTML={{__html:TextUtils.convertToHtml(post.text)}}></p>
						</div>
						<hr />
						<textarea style={styles.replyBox} placeholder='Reply'></textarea>
						<button className="button button-mini button-circle button-green">Submit Reply</button>
					</div>
				</div>
			)
		}
		else if (selected == 'chat'){ // chat
			content = (
				<div style={{overflowY:'scroll', borderRight:'1px solid #ddd', borderLeft:'1px solid #ddd', borderBottom:'1px solid #ddd'}}>
					<CreateComment onCreate={this.submitComment.bind(this)} />
					{
						this.state.comments.map((comment, i) => {
							return <Comment comment={comment} key={i} />
						})
					}
				</div>
			)
		}

//		const feed = this.props.posts[post.teams[0]]
		const teams = this.props.teams[post.author.id] // can be null

		return (
			<div className="clearfix">
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

								<hr className="hidden-xs" />
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
							{ content }
						</div>

						<div className="col_one_third col_last">

						</div>
					</div>
				</section>

			</div>
		)
	}
}

const localStyle = {
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
	}
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
//		attendEvent: (post, profile, qty) => dispatch(actions.attendEvent(post, profile, qty)),
		updatePost: (post, params) => dispatch(actions.updatePost(post, params)),
		fetchProfile: (id) => dispatch(actions.fetchProfile(id)),
		fetchTeams: (params) => dispatch(actions.fetchTeams(params))
	}

}

export default connect(stateToProps, dispatchToProps)(PostDetail)
