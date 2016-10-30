import React, { Component } from 'react'
import { APIManager } from '../../utils'
import { Post } from '../view'
import store from '../../stores/store'
import actions from '../../actions/actions'
import { connect } from 'react-redux'
import styles from './styles'

class Posts extends Component {
	constructor(){
		super()
		this.fetchPosts = this.fetchPosts.bind(this)
		this.state = {

		}
	}

	componentDidMount(){
		store.currentStore().subscribe(() => {
			setTimeout(() => { // this is a sloppy workaround
				console.log('RELOAD: ' + this.props.selectedFeed +', '+ this.props.reload)
				if (this.props.reload)
					this.fetchPosts()
			}, 5)
		})

		this.fetchPosts()
	}

	fetchPosts(){
		const params = {
			limit: 10,
			type: this.props.selectedFeed,
			lat: this.props.location.lat,
			lng: this.props.location.lng
		}

//		console.log('PARAMS: '+JSON.stringify(params))
		APIManager.handleGet('/api/post', params, (err, response) => {
			if (err){
				alert(err)
				return
			}

//			console.log(JSON.stringify(response))
			store.currentStore().dispatch(actions.postsReceived(response.results))
		})		
	}

	render(){
		const list = this.props.posts[this.props.selectedFeed]
		let currentPosts = null
		if (list != null){
			currentPosts = list.map((post, i) => {
				return (
					<li key={post.id} className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
						<Post post={post} />
					</li>
				)
			})
		}


		return (
			<div>
				<ol className="commentlist noborder nomargin nopadding clearfix">
					<li className="comment byuser comment-author-_smcl_admin even thread-odd thread-alt depth-1" id="li-comment-2">
						<div className={styles.post.container.className} style={styles.post.container}>
							<div className="comment-meta">
								<div className="comment-author vcard">
									<span className="comment-avatar clearfix">
									<img alt='The Varsity' src={'https://lh3.googleusercontent.com/OfmWs4W8_286PjOrshncso1VYO6iAvVBmrr9Kgr6lISSz-5uWo_tF7Fl-KtKrPeylWmFEkt9k0j9xmFlEPR6XGEO8P8=s120-c'} className='avatar avatar-60 photo' height='60' width='60' /></span>
								</div>
							</div>

							<div className={styles.post.content.className} style={styles.post.content}>
								<div className="col_two_third" style={{marginBottom:4}}>
									<input type="text" placeholder="Title" style={styles.post.input} /><br />
									<textarea placeholder="Text:" style={styles.post.textarea}></textarea><br />					
								</div>
								<div className="col_one_third col_last" style={{marginBottom:4}}>
									<img style={styles.post.postImage} src={'https://scontent-lga3-1.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/c150.150.600.600/14712116_676273292533229_6841608093340532736_n.jpg'} />
								</div>
							</div>

							<hr />
							<a href="#" style={styles.post.btnAdd} className={styles.post.btnAdd.className}>Add Post</a>
						</div>
					</li>
				</ol>

				<ol className="commentlist noborder nomargin nopadding clearfix">
					{ currentPosts }
				</ol>

			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		posts: state.post.feed,
		location: state.session.currentLocation,
		selectedFeed: state.session.selectedFeed,
		reload: state.session.reload
	}
}

export default connect(stateToProps)(Posts)
