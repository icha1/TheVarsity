import React, { Component } from 'react'
import { Link } from 'react-router'
import { TextUtils } from '../../utils'
import styles from './styles'

export default (props) => {

	// {"code":"jocs9t","context":{"id":"5885885a50104f9ac4f83f53",
	// "image":"https://lh3.googleusercontent.com/MEOEsxLeDGJxpVQktwtk5kAMJ_OKxY4tMqBWXTKfda7zD3jL0GjSh4iuANXKH3LljVLeyCrWhMt-9cn4MZD9M8Elvc8",
	// "name":"fucking work","slug":"fucking-workjusius","type":"project"},"email":"dennykwon2@gmail.com",
	// "from":{"email":"dan.kwon234@gmail.com","id":"586d6ed8da50870e6d1c432e",
	// "image":"https://lh3.googleusercontent.com/Sgzz2lZE7IhsS_Y6dC_L_hrbxL22bnOwSG_hI1i2NuXH9lM3adgRQdsZidR4DZOa5k2F3HBP-7uRk2z8QGxX39V8yw"},
	// "id":"588ad44db85afa905f4b000a","name":"denny kwon","schema":"invitation","status":"open",
	// "timestamp":"2017-01-27T05:02:05.242Z"}

	const context = props.context
	return (
		<div style={localStyle.container} className="container clearfix">
			<h3 style={styles.title}>{ TextUtils.capitalize(props.schema) }: {context.name}</h3>
			<hr />
			<div className="col_three_fourth" style={{marginBottom:0}}>
				You have been invited to the {context.name} {context.type} by {props.from.email}.
			</div>
			<div className="col_one_fourth col_last" style={{textAlign:'right', marginBottom:0}}>
				<img src={context.image+'=s64-c'} />
			</div>
			<Link to={'/'+context.type+'/'+context.slug} style={localStyle.btnSmall} className={localStyle.btnSmall.className}>View {context.type}</Link>
			<button style={localStyle.btnSmall} className={localStyle.btnSmall.className}>Accept Invitation</button>
		</div>

	)
}

const localStyle = {
	container: {
		textAlign: 'left',
		background: '#f9f9f9',
		border: '1px solid #ddd',
		padding: 16,
		marginBottom: 24
	},
	btnSmall: {
		marginTop: 24,
		marginRight: 12,
		className: 'button button-small button-border button-border-thin button-blue'
	}

}