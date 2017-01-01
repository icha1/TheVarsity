import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'

class FeaturedTeams extends Component {

	componentDidMount(){
		this.props.fetchTeams({limit: 5})


	}

	render(){
		const teams = this.props.teams

		return (
			<div>
				{ (teams == null) ? null : this.props.teams.map((team, i) => {
						return (
							<div key={i} style={{padding:16}}>
								<img style={localStyle.image} src={team.image+'=s44-c'} />
								<a style={localStyle.detailHeader} href="#">
									{team.name}
								</a>
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
		teams: state.team.list
	}
}

const dispatchToProps = (dispatch) => {
	return {
		fetchTeams: (params) => dispatch(actions.fetchTeams(params))
	}
}

export default connect(stateToProps, dispatchToProps)(FeaturedTeams)

