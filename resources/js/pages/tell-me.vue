<template>
	<div class="wrapper flex columns" v-cloak>
		<div class="content flex">
	    	<h2 class="witty-words flex columns">
				<span class="alfa-slab">Last thing.</span>
				<span class="josefin">Tell me about your day.</span>
				<span class="poiret">Then i'll show you the "idea" :)</span>
				<textarea v-model="text" type="text" rows="7"></textarea>
	    	</h2>
		</div>

		<div @click="send()" class="next flex">
			<h2 class="glyphicon glyphicon-chevron-right"></h2>
		</div>
	</div>
</template>

<script>
	module.exports = {
		props: ['Auth', 'background'],

		data() {
			return {
				next: '/wait-for-me',
				text: '',
			};
		},

		created() {
			return this.Auth.userCompletedStep('shook-a-little');
		},

		methods: {
			send() {
				this.$http.post('/api/tell-me', {text: this.text})
					.then(() => {
						this.$router.go(this.next);
					})
					.catch(() => {
						alert('I said TELL ME about your DAY!');
					});
			},
		}
	}
</script>