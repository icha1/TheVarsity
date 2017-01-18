import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import styles from './styles'

export default (props) => {
	const style = styles.nav

	return (
        <Modal bsSize="sm" show={props.show} onHide={props.toggle.bind(this)}>
	        <Modal.Body style={style.modal}>
	        	<div style={{textAlign:'center'}}>
		        	<img style={style.logo} src='/images/logo_dark.png' />
		        	<hr />
		        	<h4>{props.title}</h4>
	        	</div>

	        	<input onChange={props.update.bind(this)} id="name" className={style.textField.className} style={style.textField} type="text" placeholder="Name" />
	        	<input onChange={props.update.bind(this)} id="email"className={style.textField.className} style={style.textField} type="text" placeholder="Email" />
				<div style={style.btnLoginContainer}>
					<a href="#" onClick={props.submit.bind(this)} className={style.btnLogin.className}><i className="icon-lock3"></i>Send</a>
				</div>
	        </Modal.Body>
        </Modal>	    
	)
}

