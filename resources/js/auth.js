module.exports = {
	login() {
		CookieJar.set('logged_in', true, 3600);
	},

	logout() {
		CookieJar.set('logged_in', false, 36000);
	},

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