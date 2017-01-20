// this depends on the SweetAlert library: http://t4t5.github.io/sweetalert/

export default {

	showAlert: (message) => {

		// swal({
		// 	title: "Error!",
		// 	text: "Here's my error message!",
		// 	type: "error",
		// 	confirmButtonText: "Cool"
		// })

		swal(message)
	}



}