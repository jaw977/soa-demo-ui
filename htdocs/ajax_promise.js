function ajaxPromise (msg) {
	console.log("Req:",msg);
	return axios.post(soaDemoConfig.apiURL, msg).then( function(response) {
		console.log("Res:",response.data);
		if (response.data.error == 'Invalid Token.') {
			vue.user = false;
			vue.mode = 'login';
			response.data.error = 'Session expired.  Please login again.';
		}
		return response.data;
	})
	.catch( function(error) {
		console.log("Err:",error);
	});
}
