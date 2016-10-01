<template>
	<div class="wrapper flex columns" v-cloak>
		<div class="content flex">
	    	<h2 class="witty-words flex columns">
	    		<span class="alfa-slab">First</span>
				<span class="josefin">What's your middle name?</span>
				<input @keydown.enter="nextPage()" v-model="middleName" type="text" name="middle-name">
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
				next: '/came-back-for',
				middleName: '',
			};
		},

		methods: {
			nextPage() {
				this.$http.post('/api/middle-name', {middleName: this.middleName})
					.then(response => {
						if (this.middleName.toLowerCase() == 'its me isabell'
							|| this.middleName.toLowerCase() == 'it\'s me isabell') {
							this.$router.go('/its-me-isabell');
							return;
						}
						this.$router.go(this.next);
					})
					.catch(() => {
						this.$router.go('/');
					});
			},
		}
	}
</script>