import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Comment } from '../view'
import { DateUtils, FirebaseManager } from '../../utils'
import styles from './styles'

class PostDetail extends Component {
	constructor(){
		super()
		this.state = {
			selected: 0,
			comments: [],
			comment: {
				profile: null,
				text: '',
				image: ''
			},
			menuItems: [
				{name:'Overview', component:'Posts'},
				{name:'Attend', component:'CreatePost'},
				{name:'Chat', component:'ManageNotifications'}
			]
		}
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

	selectItem(index, event){
		event.preventDefault()

		const item = this.state.menuItems
		this.setState({
			selected: index
		})
	}

	updateComment(event){
//		console.log('UpdateComment: '+event.target.value)
		let updated = Object.assign({}, this.state.comment)
		updated['text'] = event.target.value
		this.setState({
			comment: updated
		})
	}

	keyPress(event){
		if (event.keyCode != 13)
			return

		if (this.props.user == null){
			alert('Please log in or register to post a comment.')
			return
		}

		const post = this.props.posts[this.props.slug]
		if (post == null)
			return

		let updated = Object.assign({}, this.state.comment)
		updated['profile'] = {
			id: this.props.user.id,
			username: this.props.user.username,
			image: this.props.user.image
		}

		const path = '/'+post.id+'/comments/'+this.state.comments.length
		FirebaseManager.post(path, updated, () => {
			console.log('callback test') // TODO: post comment to API

			this.setState({ // reset comment
				comment: {
					profile: null,
					text: '',
					image: ''
				}
			})
		})
	}

	render(){
		const style = styles.post
		const post = this.props.posts[this.props.slug]

		const sideMenu = this.state.menuItems.map((item, i) => {
			const itemStyle = (i == this.state.selected) ? styles.team.selected : styles.team.menuItem
			return (
				<li key={i}>
					<div style={itemStyle}>
						<a onClick={this.selectItem.bind(this, i)} href="#"><div>{item.name}</div></a>
					</div>
				</li>
			)
		})

		let content = null
		if (this.state.selected == 0){ // overview
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
		if (this.state.selected == 1){ // attend

		}
		if (this.state.selected == 2){ // chat
			content = (
				<div style={{overflowY:'scroll', borderRight:'1px solid #ddd', borderLeft:'1px solid #ddd', borderBottom:'1px solid #ddd'}}>
					<div style={{padding:16, background:'#ffffe6', borderTop:'1px solid #ddd'}}>
						<input value={this.state.comment.text} onKeyUp={this.keyPress.bind(this)} onChange={this.updateComment.bind(this)} type="text" className="form-control" />
					</div>
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

						<div className="col_full col_last">
							{ content }
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

export default connect(stateToProps)(PostDetail)
