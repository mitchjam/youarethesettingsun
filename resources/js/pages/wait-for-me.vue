<template>
	<div class="wrapper flex columns" v-cloak>
		<div class="content flex">
	    	<h2 class="witty-words flex columns">
				<span class="alfa-slab">Type a username and password</span>
				<span class="josefin">so you can skip all of this</span>
				<span class="poiret">next time.</span>
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
				next: '/its-me-isabell',
				username: '',
				password: '',
			};
		},

		created() {
			return this.Auth.userCompletedStep('tell-me');
		},

		methods: {
			nextPage() {
				this.$http.post('/api/wait-for-me', {username: this.username, password: this.password})
					.then(() => {
						this.$router.go(this.next);
					})
					.catch(() => {
						this.$router.go('/');
					});
			},
		}
	}
</script>