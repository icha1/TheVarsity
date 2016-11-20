import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { CreateComment, Comment, ProfilePreview } from '../view'
import { DateUtils, FirebaseManager } from '../../utils'
import styles from './styles'

class PostDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 'Overview',
			comments: [],
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
		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		FirebaseManager.register('/'+post.id+'/comments', (err, currentComments) => {
			if (err){
				return
			}

			this.setState({
				comments: currentComments.reverse()
			})
		})
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
		updated['profile'] = {
			id: this.props.user.id,
			username: this.props.user.username,
			image: this.props.user.image
		}

		const currentDistrict = this.props.session.currentDistrict
		const path = '/'+post.id+'/comments/'+this.state.comments.length
		FirebaseManager.post(path, updated, () => {
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
		this.props.attendEvent(post, this.props.user)

	}

	render(){
		const style = styles.post
		const post = this.props.posts[this.props.slug]
		const selected = this.state.selected

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
		if (selected == 'Overview'){ // overview
			content = (
				<div style={{background:'#fff', padding:24, border:'1px solid #ddd', borderRadius:2}}>
					<h2 style={style.title}>
						{ post.title }
					</h2>
					<hr />
					<p className="lead" style={{fontSize:16}}>{ post.text }</p>
					<img style={{padding:3, border:'1px solid #ddd', background:'#fff'}} src={post.image} />
				</div>
			)
		}

		if (selected == 'Attend'){ // attend
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
										<select style={{background:'#fff'}}>
											<option>1</option>
											<option>2</option>
											<option>3</option>
											<option>4</option>
											<option>5</option>
											<option>6</option>
											<option>7</option>
											<option>8</option>
											<option>9</option>
											<option>10</option>
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

		if (selected == 'Chat'){ // chat
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
								Hosted By<br />
								<img style={{padding:3, border:'1px solid #ddd', background:'#fff', marginTop:6}} src={post.author.image+'=s140'} />
								<h2 style={ style.title }>
									{ post.author.name }
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
		attendEvent: (post, profile) => dispatch(actions.attendEvent(post, profile))
	}

}

export default connect(stateToProps, dispatchToProps)(PostDetail)
