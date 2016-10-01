<template>
	<div class="wrapper flex columns" v-cloak>
		<div class="content flex">
	    	<h2 class="witty-words flex columns">
				<div>
					"
					<input style="margin-bottom: 5px; text-align: left; float: right; width: 95%;" @keydown.enter="nextPage()" v-model="shookALittle" type="text">
				</div>
				<span class="josefin">out of the bottom of your pants"</span>
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
				next: '/tell-me',
				shookALittle: '',
			};
		},

		created() {
			return this.Auth.userCompletedStep('came-back-for');
		},

		methods: {
			nextPage() {
				this.$http.post('/api/shook-a-little', {shookALittle: this.shookALittle})
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