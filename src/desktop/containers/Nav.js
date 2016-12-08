import React, { Component } from 'react'
import styles from './styles'
import { Modal } from 'react-bootstrap'
import { APIManager } from '../../utils'
import { Link, browserHistory } from 'react-router'
import actions from '../../actions/actions'
import { connect } from 'react-redux'

class Nav extends Component {
	constructor(props, context){
		super(props, context)
		this.sendCredentials = this.sendCredentials.bind(this)
		this.state = {
			showLogin: false,
			showRegister: false,
			credentials: {
				email: '',
				username: '',
				password: ''
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
			showRegister: !this.state.showRegister
		})		
	}

	updateCredentials(event){
		var updatedCredentials = Object.assign({}, this.state.credentials)
		updatedCredentials[event.target.id] = event.target.value

		this.setState({
			credentials: updatedCredentials
		})
	}

	login(event){
		if (event)
			event.preventDefault()

		this.sendCredentials('/account/login')
	}

	register(event){
		if (event)
			event.preventDefault()

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

//			store.currentStore().dispatch(actions.currentUserReceived(result.user))
			this.props.currentUserReceived(result.user)
			browserHistory.push('/account')
		})
		.catch((err) => {
			alert(err.message)
		})
	}

	render(){
		const style = styles.nav

		let accountLink, joinLink, loginLink = null
		if (this.props.user == null){
			joinLink = <li><a onClick={this.toggleRegister.bind(this)} href="#"><div>Join</div></a></li>
			loginLink = <li><a onClick={this.toggleLogin.bind(this)} href="#"><div>Login</div></a></li>
		}
		else {
			accountLink = <li><Link to="/account"><div>{this.props.user.username}</div></Link></li>
		}

		return (
			<div id="page-menu">
				<div id="page-menu-wrap">
					<div className="container clearfix">
						<div className="menu-title">
							<a href="/">
								<img src='/images/logo_white.png' />
							</a>
						</div>
						<nav className="one-page-menu">
							<ul style={style.ul}>
								<li><a href="#"><div>About</div></a></li>
								{ joinLink }
								{ loginLink }
								{ accountLink }
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
			        	<input onChange={this.updateCredentials.bind(this)} id="password" className={style.textField.className} style={style.textField} type="password" placeholder="Password" />
						<div style={style.btnLoginContainer}>
							<a onClick={this.login.bind(this)} href="#" className={style.btnLogin.className}><i className="icon-lock3"></i>Log In</a>
						</div>
			        </Modal.Body>
		        </Modal>

		        <Modal show={this.state.showRegister} onHide={this.toggleRegister.bind(this)}>
			        <Modal.Body style={style.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={style.logo} src='/images/logo_dark.png' />
				        	<hr />
			        	</div>
			        	<div className="col_half">
			        		<div style={{padding:16, background:'#fff', border:'1px solid #ddd'}}>
				        		Sign Up
			        		</div>
			        	</div>

			        	<div className="col_half col_last">
				        	<input onChange={this.updateCredentials.bind(this)} id="email" className={style.textField.className} style={style.textField} type="text" placeholder="Email" />
				        	<input onChange={this.updateCredentials.bind(this)} id="username" className={style.textField.className} style={style.textField} type="text" placeholder="Username" />
				        	<input onChange={this.updateCredentials.bind(this)} id="password" className={style.textField.className} style={style.textField} type="password" placeholder="Password" />
							<div style={style.btnLoginContainer}>
								<a onClick={this.register.bind(this)} href="#" className={style.btnLogin.className}><i className="icon-lock3"></i>Sign Up</a>
							</div>
			        	</div>
			        </Modal.Body>

		        </Modal>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {
		user: state.account.currentUser
	}
}

const dispatchToProps = (dispatch) => {
	return {
		currentUserReceived: (user) => dispatch(actions.currentUserReceived(user))

	}
}

export default connect(stateToProps, dispatchToProps)(Nav)