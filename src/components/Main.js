import React, { Component } from 'react'
import Loader from 'react-loader'
import { Nav } from './containers'
import { connect } from 'react-redux'

class Main extends Component {

	render(){
		return (
			<div className="stretched side-header">
				<Loader options={styles.loader} loaded={!this.props.showLoading} className="spinner" loadedClassName="loadedContent" />
				<Nav />
				<div id="wrapper">
					{this.props.children}
				</div>

			</div>
		)
	}
}

const styles = {
	loader: {
	    lines: 13,
	    length: 20,
	    width: 10,
	    radius: 30,
	    corners: 1,
	    rotate: 0,
	    direction: 1,
	    color: '#fff',
	    speed: 1,
	    trail: 60,
	    shadow: false,
	    hwaccel: false,
	    zIndex: 2e9,
	    top: '50%',
	    left: '50%',
	    scale: 1.00
	}	
}

const stateToProps = (state) => {
	return {
		showLoading: state.session.showLoading
	}
}

export default connect(stateToProps)(Main)
