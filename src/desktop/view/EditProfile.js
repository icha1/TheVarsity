import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Loading from 'react-loading' // http://cezarywojtkowski.com/react-loading/
import { Link } from 'react-router'
import { DateUtils, TextUtils, APIManager } from '../../utils'
import styles from './styles'

class EditProfile extends Component {
	constructor(){
		super()
		this.state = {
			isLoading: false,
			updatedProfile: {
				changed: false,
				image: '',
				location: {
					city:'',
					state:''
				}
			}
		}
	}

	componentDidMount(){
		let updated = Object.assign({}, this.state.updatedProfile)
		updated['image'] = this.props.profile.image
		if (this.props.profile.location != null)
			updated['location'] = Object.assign({}, this.props.profile.location)
		
		this.setState({
			updatedProfile: updated
		})
	}

	btnCloseClicked(event){
		event.preventDefault()
		if (this.state.updatedProfile.changed){
			let updated = Object.assign({}, this.state.updatedProfile)
			delete updated['changed']
			this.props.update(updated)
			return
		}

		this.props.close()
	}

	updateProfile(event){
		let updated = Object.assign({}, this.state.updatedProfile)
		updated['changed'] = true
		const key = event.target.id
		if (key == 'city' || key == 'state'){
			let updatedLocation = Object.assign({}, updated.location)
			updatedLocation[key] = event.target.value
			updated['location'] = updatedLocation
		}
		else {
			updated[key] = event.target.value
		}

		this.setState({
			updatedProfile: updated
		})
	}

	uploadImage(files){
		this.setState({isLoading: true})
		APIManager.upload(files[0], (err, image) => {
			this.setState({isLoading: false})
			if (err){
				alert(err)
				return
			}

			let updated = Object.assign({}, this.state.updatedProfile)
			updated['image'] = image.address
			updated['changed'] = true
			this.setState({
				updatedProfile: updated
			})
		})
	}

	render(){
		const profile = this.props.profile
		const location = profile.location || {city:'', state:''}
		const image = (this.state.updatedProfile.image.length == 0) ? '/images/image-placeholder.png' : this.state.updatedProfile.image+'=s220-c'

		return (
			<div>
				<input type="text" id="title" placeholder="Title (Photographer, etc)" style={localStyle.input} onChange={this.updateProfile.bind(this)} defaultValue={profile.title} />
				<input type="text" id="username" placeholder="Username" style={localStyle.input} onChange={this.updateProfile.bind(this)} defaultValue={profile.username} />
				<input type="text" id="city" placeholder="City" style={localStyle.input} onChange={this.updateProfile.bind(this)} defaultValue={location.city} />
				<select style={localStyle.input} defaultValue={location.state} id="state" onChange={this.updateProfile.bind(this)}>
					{
						statesList.map((state, i) => {
							return <option key={state.abbreviation} value={state.abbreviation.toLowerCase()}>{state.name}</option>
						})
					}
				</select>
				<textarea id="bio" placeholder="Bio" onChange={this.updateProfile.bind(this)} style={localStyle.textarea} defaultValue={profile.bio}></textarea>
				<Dropzone onDrop={this.uploadImage.bind(this)} className="clearfix visible-md visible-lg">
					{ (this.state.updatedProfile.image.length > 0) ? <div><img src={image} /><br />Click to Change</div> :
						<button className="social-icon si-small si-borderless si-instagram">
							<i className="icon-instagram"></i>
							<i className="icon-instagram"></i>
						</button>
					}
					<div style={{float:'right', width:50+'%'}}>
						{ (this.state.isLoading) ? <Loading type='bars' color='#333' /> : null }
					</div>
				</Dropzone>	            
	            <a href="#" onClick={this.btnCloseClicked.bind(this)} className="button button-circle button-green" style={localStyle.btnBlue}>Done</a>
			</div>
		)
	}
}

const localStyle = {
	btnBlue: {
		float: 'right',
		className: 'button button-small button-circle button-blue'
	},
	input: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 20,
		fontFamily:'Pathway Gothic One',
		border: 'none',
		width: 100+'%'
	},
	textarea: {
		color:'#333',
		background: '#f9f9f9',
		marginBottom: 12,
		padding: 6,
		fontWeight: 100,
	    lineHeight: 1.5,
	    fontSize: 16,
		border: 'none',
		width: 100+'%',
		fontFamily:'Pathway Gothic One',
		minHeight: 220
	}
}

const statesList = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
]

export default EditProfile