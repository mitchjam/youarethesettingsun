<template>
	<div class="wrapper flex columns" v-cloak>
		<div class="content flex">
	    	<h2 class="witty-words flex columns">
	    		<span class="alfa-slab">Hey! You're here!</span>
				<span class="josefin">took you long enough... ;)</span>
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
				next: '/middle-name',
			}
		},

		methods: {
			nextPage() {
				this.$router.go(this.next);
			},
		}
	}
</script>