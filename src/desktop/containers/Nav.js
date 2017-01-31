import React, { Component } from 'react'
import styles from './styles'
import { Modal } from 'react-bootstrap'
import { APIManager, TextUtils } from '../../utils'
import { Link, browserHistory } from 'react-router'
import actions from '../../actions/actions'
import { connect } from 'react-redux'

class Nav extends Component {
	constructor(props, context){
		super(props, context)
		this.sendCredentials = this.sendCredentials.bind(this)
		this.login = this.login.bind(this)
		this.register = this.register.bind(this)
		this.state = {
			showLogin: false,
			showRegister: false,
			showFeedback: false,
			credentials: {
				email: '',
				username: '',
				password: ''
			},
			feedback: {
				path: '',
				comment: '',
				profile: {}
			}
		}
	}

	toggleLogin(event){
		if (event)
			event.preventDefault()
		
		this.setState({
			showLogin: !this.state.showLogin
		})
	}

	toggleRegister(event){
		if (event)
			event.preventDefault()
		
		this.setState({
			showRegister: !this.state.showRegister,
		})		
	}

	toggleFeedback(event){
		if (event)
			event.preventDefault()
		
		this.setState({
			showFeedback: !this.state.showFeedback,
		})
	}

	updateCredentials(event){
		var updatedCredentials = Object.assign({}, this.state.credentials)
		updatedCredentials[event.target.id] = event.target.value

		this.setState({
			credentials: updatedCredentials
		})
	}

	updateFeedback(event){
		let updated = Object.assign({}, this.state.feedback)
		updated[event.target.id] = event.target.value

		this.setState({
			feedback: updated
		})
	}

	sendFeedback(event){
		event.preventDefault()
		let updated = Object.assign({}, this.state.feedback)
		updated['path'] = window.location.pathname
		if (this.props.user != null){
			updated['profile'] = {
				id: this.props.user.id,
				username: this.props.user.username
			}			
		}

		this.setState({showFeedback: false})

		APIManager.handlePost('/api/feedback', updated)
		.then(response => {
			console.log(JSON.stringify(response))
			alert('Thanks for your feedback!')
		})
		.catch((err) => {

		})
	}

	login(event){
		if (event)
			event.preventDefault()

		// validate fields
		if (this.state.credentials.email.length == 0){
			alert('Please enter your email')
			return
		}
		if (this.state.credentials.password.length == 0){
			alert('Please enter your password')
			return
		}

		this.sendCredentials('/account/login')
	}

	register(event){
		if (event)
			event.preventDefault()

		// validate fields
		if (this.state.credentials.email.length == 0){
			alert('Please enter your email')
			return
		}
		if (TextUtils.validateEmail(this.state.credentials.email) == false){
			alert('Please enter a valid email')
			return
		}		
		if (this.state.credentials.username.length == 0){
			alert('Please enter your username')
			return
		}
		if (this.state.credentials.password.length == 0){
			alert('Please enter your password')
			return
		}

		this.sendCredentials('/account/register')
	}

	sendCredentials(endpoint){
		APIManager
		.handlePost(endpoint, this.state.credentials)
		.then((result) => {
			this.setState({
				showRegister: false,
				showLogin: false
			})

			this.props.currentUserReceived(result.user)
			browserHistory.push('/account')
		})
		.catch((err) => {
			alert(err.message)
		})
	}

	keyPress(action, event){
		if (event.charCode != 13)
			return

		if (action == 'register')
			this.register()
		else
			this.login()
	}

	render(){
		const style = styles.nav

		const user = this.props.user 
		let accountLink, joinLink, loginLink, notifications = null
		if (user == null){
			joinLink = <li><a onClick={this.toggleRegister.bind(this)} href="#"><div>Join</div></a></li>
			loginLink = <li><a onClick={this.toggleLogin.bind(this)} href="#"><div>Login</div></a></li>
		}
		else {
			accountLink = (
				<li>
					<Link style={{display:'inline-block'}} to="/account">
						<span>{user.username}</span>
					</Link>
				</li>
			)
		}

		if (this.props.account.notifications.length > 0){
			notifications = (
				<li>
					<a onClick={this.toggleLogin.bind(this)} href="#">
						<div style={localStyle.badge}>{this.props.account.notifications.length}</div>
					</a>
				</li>
			)
		}

		return (
			<div id="page-menu">
				<div id="page-menu-wrap">
					<div className="container clearfix">
						<div className="menu-title">
							{ (user == null) ? <a href="/"><img src='/images/logo_white.png' /></a> :
								<Link to="/feed"><img src='/images/logo_white.png' /></Link>
							}

						</div>
						<nav className="one-page-menu">
							<ul style={style.ul}>
								<li><a href="/"><div>About</div></a></li>
								<li><a onClick={this.toggleFeedback.bind(this)} href="#"><div>Feedback</div></a></li>
								{ loginLink }
								{ accountLink }
								{ notifications }
							</ul>
						</nav>
						<div id="page-submenu-trigger"><i className="icon-reorder"></i></div>
					</div>
				</div>

		        <Modal bsSize="sm" show={this.state.showLogin} onHide={this.toggleLogin.bind(this)}>
			        <Modal.Body style={style.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={style.logo} src='/images/logo_dark.png' />
				        	<hr />
				        	<h4>Log In</h4>
			        	</div>

			        	<input onChange={this.updateCredentials.bind(this)} id="email" className={style.textField.className} style={style.textField} type="text" placeholder="Email" />
			        	<input onChange={this.updateCredentials.bind(this)} id="password" onKeyPress={this.keyPress.bind(this, 'login')} className={style.textField.className} style={style.textField} type="password" placeholder="Password" />
						<div style={style.btnLoginContainer}>
							<a onClick={this.login.bind(this)} href="#" className={style.btnLogin.className}><i className="icon-lock3"></i>Log In</a>
						</div>
			        </Modal.Body>
		        </Modal>

		        <Modal bsSize="sm" show={this.state.showRegister} onHide={this.toggleRegister.bind(this)}>
			        <Modal.Body style={style.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={style.logo} src='/images/logo_dark.png' />
				        	<hr />
				        	<h4>Sign Up</h4>
			        	</div>

			        	<input onChange={this.updateCredentials.bind(this)} id="email" className={style.textField.className} style={style.textField} type="text" placeholder="Email" />
			        	<input onChange={this.updateCredentials.bind(this)} id="username" className={style.textField.className} style={style.textField} type="text" placeholder="Username" />
			        	<input onChange={this.updateCredentials.bind(this)} onKeyPress={this.keyPress.bind(this, 'register')} id="password" className={style.textField.className} style={style.textField} type="password" placeholder="Password" />
						<div style={style.btnLoginContainer}>
							<a onClick={this.register.bind(this)} href="#" className={style.btnLogin.className}><i className="icon-lock3"></i>Sign Up</a>
						</div>
			        </Modal.Body>
		        </Modal>

		        <Modal show={this.state.showFeedback} onHide={this.toggleFeedback.bind(this)}>
			        <Modal.Body style={style.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={style.logo} src='/images/logo_dark.png' />
				        	<hr />
				        	<h4>Feedback</h4>
			        	</div>

			        	<textarea id="comment" onChange={this.updateFeedback.bind(this)} className={style.textField.className} style={localStyle.textarea}></textarea>
						<div style={style.btnLoginContainer}>
							<a onClick={this.sendFeedback.bind(this)} href="#" className={style.btnLogin.className}>Submit</a>
						</div>
			        </Modal.Body>
		        </Modal>		        
			</div>
		)
	}
}

const localStyle = {
	textarea: {
		border: '1px solid #ddd',
		minHeight: 160
	},
	badge: {
		color: '#fff',
		background: '#FF6565',
		width: 26,
		height: 26,
		borderRadius: 13,
		fontSize: 12+'px',
		textAlign: 'center'
	}
}

const stateToProps = (state) => {
	return {
		account: state.account,
		user: state.account.currentUser
	}
}

const dispatchToProps = (dispatch) => {
	return {
		currentUserReceived: (user) => dispatch(actions.currentUserReceived(user))

	}
}

export default connect(stateToProps, dispatchToProps)(Nav)