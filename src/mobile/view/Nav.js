import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'

class Nav extends Component {

	btnRightAction(event){
		event.preventDefault()
		console.log('btnRightAction: ')
		this.props.toggleShowMap(true)
	}

	render(){
		return (
			<div className="navbar">
				<div className="navbar-inner">
				    <div className="left sliding">
				    	<a href="#" data-panel="left" className="open-panel link icon-only">
				    		<i className="fa fa-bars"></i>
				    	</a>
				    </div>
				    <div className="center">MaxSmart</div>
				    <div className="right sliding">
				    	<a onClick={this.btnRightAction.bind(this)} href="#"  data-panel="right" className="open-panel link icon-only">
				    		<i className="fa fa-envelope"></i>
				    	</a>
				    </div>
				</div>
			</div>
		)
	}
}

const stateToProps = (state) => {
	return {

	}
}

const dispatchToProps = (dispatch) => {
	return {
		toggleShowMap: (show) => dispatch(actions.toggleShowMap(show))

	}
}

export default connect(stateToProps, dispatchToProps)(Nav)