import React, { Component } from 'react'
import styles from './styles'
import { Modal } from 'react-bootstrap'
import { APIManager } from '../../utils'
import { Link } from 'react-router'

class Nav extends Component {
	constructor(props, context){
		super(props, context)
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
	}

	register(event){
		if (event)
			event.preventDefault()

		console.log('Register: '+JSON.stringify(this.state.credentials))
		let url = '/account/register'
		APIManager.handlePost(url, this.state.credentials, (err, response) => {
			if (err){
				alert(err)
				return
			}

			console.log(JSON.stringify(response))
		})
	}

	render(){
		const style = styles.nav

		return (
			<div id="page-menu">
				<div id="page-menu-wrap">
					<div className="container clearfix">
						<div className="menu-title">
							<a style={style.title} href="/">The Varsity</a>
						</div>
						<nav className="one-page-menu">
							<ul style={style.ul}>
								<li><a href="#"><div>About</div></a></li>
								<li><a onClick={this.toggleRegister.bind(this)} href="#"><div>Join</div></a></li>
								<li><a onClick={this.toggleLogin.bind(this)} href="#"><div>Login</div></a></li>
								<li><Link to="/account"><div>Account</div></Link></li>
							</ul>
						</nav>
						<div id="page-submenu-trigger"><i className="icon-reorder"></i></div>
					</div>
				</div>

		        <Modal bsSize="sm" show={this.state.showLogin} onHide={this.toggleLogin.bind(this)}>
			        <Modal.Body style={style.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={style.logo} src='/images/logo_round_blue_260.png' />
				        	<h4>Log In</h4>
			        	</div>

			        	<input onChange={this.updateCredentials.bind(this)} id="email" className={style.textField.className} style={style.textField} type="text" placeholder="Email" />
			        	<input onChange={this.updateCredentials.bind(this)} id="password" className={style.textField.className} style={style.textField} type="password" placeholder="Password" />
						<div style={style.btnLoginContainer}>
							<a onClick={this.login.bind(this)} href="#" className={style.btnLogin.className}><i className="icon-lock3"></i>Log In</a>
						</div>
			        </Modal.Body>
		        </Modal>

		        <Modal bsSize="medium" show={this.state.showRegister} onHide={this.toggleRegister.bind(this)}>
			        <Modal.Body style={style.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={style.logo} src='/images/logo_round_blue_260.png' />
				        	<h4>Sign Up</h4>
			        	</div>
			        	<hr />
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
								<a onClick={this.register.bind(this)} href="#" className={style.btnLogin.className}><i className="icon-lock3"></i>Join</a>
							</div>
			        	</div>
			        </Modal.Body>
		        </Modal>		        
			</div>
		)
	}
}

export default Nav