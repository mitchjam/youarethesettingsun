<template>
	<div  class="wrapper flex columns" v-cloak>
		<div class="content flex">
	    	<h2 class="witty-words flex columns">
				<span class="josefin">"I came back for my...</span>
				<input @keydown.enter="nextPage()" v-model="cameBackFor" type="text" name="middle-name">"
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
				next: '/shook-a-little',
				cameBackFor: '',
			};
		},

		created() {
			return this.Auth.userCompletedStep('middle-name');
		},

		methods: {
			nextPage() {
				this.$http.post('/api/came-back-for', {cameBackFor: this.cameBackFor})
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