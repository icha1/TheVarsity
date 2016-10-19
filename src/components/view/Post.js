import React, { Component } from 'react'

class Post extends Component {

	render(){
		const post = this.props.post
		return (
			<div className="comment-wrap clearfix" style={{background:'#fff'}}>
				<div className="comment-meta">
					<div className="comment-author vcard">
						<span className="comment-avatar clearfix">
						<img alt='' src='http://1.gravatar.com/avatar/30110f1f3a4238c619bcceb10f4c4484?s=60&amp;d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D60&amp;r=G' className='avatar avatar-60 photo' height='60' width='60' /></span>
					</div>
				</div>
				<div className="comment-content clearfix" style={{textAlign:'left'}}>
					<h2 style={{marginBottom:0}}>
						<a href='#' style={{color:'#333', fontFamily:'Pathway Gothic One'}}>{ post.title }</a>
					</h2>
					<div className="row">
						<div className="col-md-8">
							<p style={{marginTop:0}}>{ post.text }</p>
						</div>
						<div className="col-md-4">
							<img style={{width:180, marginTop:12}} src={post.image} />
						</div>
					</div>
				</div>
				<div className="clear"></div>
			</div>			
		)
	}
}


export default Post