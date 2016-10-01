module.exports = {
	check() {
		this.Vue.$http.post('/api/its-me-isabell', {username: this.username, password: this.password})
			.then(() => {
				return;
			})
			.catch(() => {
				this.Vue.$router.go('/');
			});
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