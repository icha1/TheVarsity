import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import { Link } from 'react-router'
import { TextUtils } from '../../utils'

class FeaturedTeams extends Component {
	constructor(){
		super()
		this.state = {
			selectedCategory: 'software'
		}
	}

	componentDidMount(){
		this.props.fetchTeams({limit:5, type:this.state.selectedCategory})
	}

	componentDidUpdate(){
		console.log('componentDidUpdate: '+this.state.selectedCategory)
		const teams = this.props.teams[this.state.selectedCategory]
		if (teams != null)
			return
		
		this.props.fetchTeams({limit:5, type:this.state.selectedCategory})
	}

	selectCategory(event){
//		console.log('selectCategory: '+event.target.value)
		this.setState({
			selectedCategory: event.target.value
		})
	}

	render(){
		const teams = this.props.teams[this.state.selectedCategory]

		return (
			<div>
				<select onChange={this.selectCategory.bind(this)} className="selectpicker">
					<option value="software">Software</option>
					<option value="graphic design">Graphic Design</option>
					<option value="web design">Web Design</option>
				</select>

				{ (teams == null) ? null : teams.map((team, i) => {
						return (
							<div key={team.id} style={{padding:'16px 16px 16px 0px'}}>
								<Link to={'/team/'+team.slug}>
									<img style={localStyle.image} src={team.image+'=s44-c'} />
								</Link>
								<Link style={localStyle.detailHeader} to={'/team/'+team.slug}>
									{team.name}
								</Link>
								<br />
								<span style={localStyle.subtext}>{ TextUtils.capitalize(team.type) }</span>
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


