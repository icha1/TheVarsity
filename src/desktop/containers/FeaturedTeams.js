import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Link } from 'react-router'

class FeaturedTeams extends Component {

	componentDidMount(){
		this.props.fetchTeams({limit: 5, status:'featured'})
	}

	render(){
		const teams = this.props.teams['featured']

		return (
			<div>
				{ (teams == null) ? null : teams.map((team, i) => {
						return (
							<div key={i} style={{padding:16}}>
								<Link to={'/team/'+team.slug}>
									<img style={localStyle.image} src={team.image+'=s44-c'} />
								</Link>
								<Link style={localStyle.detailHeader} to={'/team/'+team.slug}>
									{team.name}
								</Link>
								<br />
								<span style={localStyle.subtext}>{team.members.length} members</span>
							</div>
						)
					})
				}
			</div>
		)
	}
}

const localStyle = {
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
		fontWeight:100,
		fontSize:14,
		lineHeight:14+'px'
	}
}

const stateToProps = (state) => {
	return {
		teams: state.team
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchTeams: (params) => dispatch(actions.fetchTeams(params))
	}
}

export default connect(stateToProps, dispatchToProps)(FeaturedTeams)


