module.exports = {
	check() {
		if (! CookieJar.get('logged_in')) {
			this.Vue.$router.go('/');
		};
	},

	init(Vue) {
		this.Vue = Vue;
		return this;
	},

	userCompletedStep(stepName) {
		return this.Vue.$http.post('/auth/' + stepName)
			.catch(error => {
				this.Vue.$router.go('/');
			});
	}
}