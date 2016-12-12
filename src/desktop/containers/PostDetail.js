import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import actions from '../../actions/actions'
import { CreateComment, Comment, ProfilePreview } from '../view'
import { DateUtils, FirebaseManager } from '../../utils'
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
			numTickets: 1,
			updatedPost: {
				changed: false
			},
			menuItems: [
				{name:'Overview', component:'Posts'},
				{name:'Chat', component:'ManageNotifications'}
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

		if (post.type != 'event')
			return

		// Events Menu
		this.setState({
			menuItems: [
				{name:'Overview', component:'Posts'},
				{name:'Attend', component:'CreatePost'},
				{name:'Chat', component:'ManageNotifications'}
			]
		})
	}

	componentDidMount(){
		window.scrollTo(0, 0)
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		// sloppy workaround, render timestamp client side:
		this.setState({
			timestamp: DateUtils.formattedDate(post.timestamp)
		})

		FirebaseManager.register('/'+post.id+'/comments', (err, currentComments) => {
			if (err){
				return
			}

			this.setState({
				comments: currentComments.reverse()
			})
		})

		// Track view count:
		const userId = (this.props.user == null) ? 'unregistered' : this.props.user.id
		let updatedViewed = Object.assign({}, post.viewed)
		updatedViewed[userId] = (updatedViewed[userId] == null) ? 1 : updatedViewed[userId]+1
		let total = 0
		Object.keys(updatedViewed).forEach((key, i) => {
			if (key != 'total')
				total += updatedViewed[key]
		})

		updatedViewed['total'] = total
		this.props.updatePost(post, {viewed: updatedViewed})
	}

	selectItem(name, event){
		event.preventDefault()
		window.scrollTo(0, 0)

		this.setState({
			selected: name
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

	attendEvent(event){
		event.preventDefault()

		if (this.props.user == null){
			alert('Please register or log in to attend this event.')
			return
		}

		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		const rsvp = (post.eventDetails.rsvp == null) ? {} : post.eventDetails.rsvp
		if (rsvp[this.props.user.id] != null){
			alert('You are already registered for this event.')
			return
		}

		// download fresh copy of post, update rsvp list, send put call:
		this.props.attendEvent(post, this.props.user, this.state.numTickets)
	}

	updateNumTickets(event){
		event.preventDefault()
		console.log('updateRsvp: '+event.target.value)

		this.setState({
			numTickets: event.target.value
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
		const selected = this.state.selected.toLowerCase()

		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (item.name == selected) ? styles.team.selected : styles.team.menuItem
			return (
				<li key={i}>
					<div style={itemStyle}>
						<a onClick={this.selectItem.bind(this, item.name)} href="#"><div>{item.name}</div></a>
					</div>
				</li>
			)
		})

		let content = null

		if (this.state.isEditing == true){
			const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
			const btnType = <a href="#" style={{marginLeft: 0}} className={btnClass}>{ post.type }</a>
			content = (
				<div style={{background:'#fff', padding:24, border:'1px solid #ddd', borderRadius:2}}>
					<div style={{lineHeight:18+'px', textAlign:'right'}}>
						<button onClick={this.toggleEditing.bind(this)} style={{float:'left', marginRight:12}}>Cancel</button>
						<button onClick={this.toggleEditing.bind(this)} style={{float:'left'}}>Done</button>
						<img style={{float:'right', marginLeft:10, borderRadius:18}} src={post.author.image+'=s36-c'} />
						<span>{ post.author.name }</span><br />
						<span style={{fontWeight:100, fontSize:11}}>{ this.state.timestamp }</span>
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
					btnEdit = <button onClick={this.toggleEditing.bind(this)} style={{float:'left'}}>Edit</button>
			}

			const btnClass = (post.type == 'news') ? 'button button-mini button-circle button-red' : 'button button-mini button-circle button-green'
			const btnType = <a href="#" style={{marginLeft: 0}} className={btnClass}>{ post.type }</a>

			content = (
				<div style={{background:'#fff', padding:24, border:'1px solid #ddd', borderRadius:2}}>
					<div style={{lineHeight:18+'px', textAlign:'right'}}>
						{ btnEdit }
						<img style={{float:'right', marginLeft:10, borderRadius:18}} src={post.author.image+'=s36-c'} />
						<span><Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link></span><br />
						<span style={{fontWeight:100, fontSize:11}}>{ this.state.timestamp }</span><br />
					</div>


					<h2 style={style.title}>
						{ (post.url.length == 0) ? post.title : <a target='_blank' style={style.title} href={post.url}>{post.title }</a> }
					</h2>
					<hr style={{marginBottom:6}} />
					{ btnType }
					<p className="lead" style={{fontSize:16, marginTop:8}}>{ post.text }</p>
					{ ( post.image.length == 0) ? null : <img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={post.image} /> }
					<textarea style={{marginTop:16, marginBottom:6, border:'none', fontSize:16, color:'#555', width:100+'%', minHeight:120, background:'#f9f9f9', padding:6, resize: 'none'}} placeholder='Reply'></textarea>
					<button>Submit Reply</button>
				</div>
			)
		}
		else if (selected == 'attend'){ // attend
			const rsvpList = (post.eventDetails.rsvp == null) ? [] : Object.keys(post.eventDetails.rsvp)

			content = (
				<div>
					<div style={{background:'#fff', padding:24, border:'1px solid #ddd', borderRadius:2}}>
						<h2 style={style.title}>
							Attend { post.title }
						</h2>
						<hr />
						<table className="table table-striped">
							<thead>
								<tr>
									<td><strong>Type</strong></td>
									<td><strong>Price</strong></td>
									<td><strong>QTY</strong></td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>General</td>
									<td>Free</td>
									<td>
										<select onChange={this.updateNumTickets.bind(this)} style={{background:'#fff'}}>
											<option value='1'>1</option>
											<option value='2'>2</option>
											<option value='3'>3</option>
											<option value='4'>4</option>
											<option value='5'>5</option>
											<option value='6'>6</option>
											<option value='7'>7</option>
											<option value='8'>8</option>
											<option value='9'>9</option>
											<option value='10'>10</option>
										</select>
									</td>
								</tr>
							</tbody>
						</table>
						<a href="#" onClick={this.attendEvent.bind(this)} style={{float:'right', margin:0}} className='button button-small button-circle button-blue clearfix'>RSVP</a>
						<br />
					</div>

					<div className="feature-box center media-box fbox-bg">
						<div className="fbox-desc">
							<div style={{textAlign:'left', padding:24, borderTop:'1px solid #ddd'}}>
								<h2 style={{fontFamily:'Pathway Gothic One', marginBottom:0}}>Attending</h2>
							</div>

							<div style={{borderTop:'1px solid #ddd', textAlign:'left'}}>
									{
										rsvpList.map((attendeeId, i) => {
											const attendee = post.eventDetails.rsvp[attendeeId]
											return (
												<ProfilePreview key={attendee.id} profile={attendee} />
											)
										})
									}
							</div>

						</div>
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

		return (
			<div className="clearfix">		

				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">
							<div style={{paddingTop:96}}>
								<img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginTop:6}} src={post.author.image+'=s140'} />
								<h2 style={ style.title }>
									<Link to={'/'+post.author.type+'/'+post.author.slug}>{ post.author.name }</Link>
								</h2>
								<hr />
								<nav id="primary-menu">
									<ul>{ sideMenu }</ul>
								</nav>

							</div>
			            </div>

		            </div>
				</header>

				<section id="content" style={{background:'#f9f9f9', minHeight:800}}>
					<div className="content-wrap container clearfix">
						<div className="col_two_third">
							{ content }
						</div>

						<div className="col_one_third col_last">
							Right Side
						</div>
					</div>

				</section>

			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser,
		session: state.session,
		posts: state.post.map,
		teams: state.team.map
	}
}

const dispatchToProps = (dispatch) => {
	return {
		attendEvent: (post, profile, qty) => dispatch(actions.attendEvent(post, profile, qty)),
		updatePost: (post, params) => dispatch(actions.updatePost(post, params))
	}

}

export default connect(stateToProps, dispatchToProps)(PostDetail)
