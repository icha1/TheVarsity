import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Link } from 'react-router'
import { TextUtils } from '../../utils'
import BaseContainer from './BaseContainer'
import styles from './styles'

class FeaturedProjects extends Component {
	constructor(){
		super()
		this.state = {

		}
	}

	componentDidMount(){
		this.props.fetchData('project', {status:'featured', limit:10}, false)
	}


	render(){
		const projects = this.props.projects['featured']

		return (
			<div>
				<h3 style={localStyle.title}>Featured Projects</h3>
				<hr />
				{ (projects == null) ? null : projects.map((project, i) => {
						return (
							<div key={project.id} style={localStyle.container}>
								<Link to={'/project/'+project.slug}>
									<img style={localStyle.image} src={project.image+'=s44-c'} />
								</Link>
								<Link style={localStyle.detailHeader} to={'/project/'+project.slug}>
									{project.title}
								</Link>
								<br />
								<span style={localStyle.subtext}>{project.collaborators.length} Collaborators</span>
							</div>
						)
					})
				}
			</div>
		)
	}
}

const localStyle = {
	container: {
		padding:'16px 16px 16px 0px'
	},
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		marginBottom: 0
	},
	detailHeader: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100,
		fontSize: 18,
		lineHeight: 10+'px'
	},
	image: {
		float:'left',
		marginRight:12,
		borderRadius:22,
		width:44
	},
	subtext: {
		fontWeight: 100,
		fontSize: 12,
		lineHeight: 12+'px'
	}
}

const stateToProps = (state) => {
	return {
		teams: state.team,
		projects: state.project
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchTeams: (params) => dispatch(actions.fetchTeams(params))
	}
}

export default connect(stateToProps, dispatchToProps)(BaseContainer(FeaturedProjects))


