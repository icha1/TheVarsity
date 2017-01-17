export default {
	title: {
		color:'#333',
		fontFamily:'Pathway Gothic One',
		fontWeight: 100
	},	
	paragraph: {
		color:'#333',
		fontWeight: 100		
	},	
	comment: {
		container: {
			borderTop:'1px solid #ddd',
			background: '#fff',
			minHeight: 140
		},
		rightBox: {
			float: 'right',
			background: '#eee',
			textAlign: 'left',
			width: 80,
			minHeight: 139,
			padding: 12,
			paddingTop: 40,
			marginLeft: 10,
			fontWeight: 100,
			lineHeight: 16+'px'
		},
		body: {
			padding: 16,
			textAlign: 'left'			
		},
		header: {
			fontFamily: 'Pathway Gothic One',
			fontSize: 22
		}		
	},
	post: {
		container: {
			background:'#fff',
			className: 'comment-wrap clearfix'
		},
		content: {
			textAlign:'left',
			className: 'comment-content clearfix'
		},
		header: {
			marginBottom:0,
			fontFamily:'Pathway Gothic One',
			fontWeight: 400
		},
		title: {
			color:'#333',
			fontFamily:'Pathway Gothic One'
		},
		postImage: {
			maxWidth: 72,
			marginTop: 0,
			padding: 3,
			border: '1px solid #ddd'
		},
		input: {
			color:'#333',
			fontWeight: 200,
		    lineHeight: 1.5,
		    fontSize: 30,
			fontFamily:'Pathway Gothic One',
			border: 'none',
			width: 100+'%',
			marginTop: 16
		},
		textarea: {
			border: 'none',
			width: 100+'%',
			minHeight: 100,
			resize: 'none'
		},
		btnAdd: {
			float: 'right',
			marginTop: 0,
			className: 'button button-medium button-circle button-blue'
		},
		select: {
			marginBottom:16,
			borderBottom:'1px solid #ddd',
			borderTop: 'none',
			borderLeft: 'none',
			borderRight: 'none',
			borderRadius:0,
			boxShadow:'none',
			width: 100+'%'
		},
		admin: {
			background: '#fff',
			padding: 10,
			position: 'fixed',
			bottom: 0,
			width: 44+'%',
			minWidth: 320,
			border: '1px solid #ddd'
		},
		listItem: {
			marginTop: 10
		}
	},
	image: {
		maxWidth: 120,
		marginTop: 0,
		padding: 3,
		border: '1px solid #ddd'
	},
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