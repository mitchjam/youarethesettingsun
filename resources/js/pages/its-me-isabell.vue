<template>
	<div class="wrapper flex columns" v-cloak>
		<div class="content flex">
	    	<h2 class="witty-words flex columns">
				<span class="fjalla">If it's you</span>
				<span class="monoton">i'm excited!!!</span>
				<input v-model="username" type="text">
				<input @keydown.enter="nextPage()" v-model="password" type="password">
	    	</h2>
		</div>

		<div @click="nextPage()" class="next flex">
			<h2 class="glyphicon glyphicon-chevron-right"></h2>
		</div>
	</div>
</template>

<script>
	module.exports = {
		props: ['Auth', 'background'],

		data() {
			return {
				next: '/notebook',
				username: '',
				password: '',
			};
		},

		methods: {
			nextPage() {
				this.$http.post('/api/its-me-isabell', {username: this.username, password: this.password})
					.then(() => {
						this.Auth.login();

						this.$router.go(this.next);
					})
					.catch(() => {
						return;
					});
			},
		}
	}
</script>