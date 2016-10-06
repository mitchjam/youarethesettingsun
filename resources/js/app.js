var Vue = window.Vue = require('vue');
var VueResource = require('vue-resource');
var VueRouter = require('vue-router');
var Auth = window.Auth = require('./auth');
var CookieJar = window.CookieJar = require('./cookie');

Vue.use(VueResource);
Vue.use(VueRouter);

var App = Vue.extend({
	data() {
		return {
			Auth: Auth,
			background: 'crecent-ken',
		};
	},

	created() {
		if (window.innerWidth < window.innerHeight) {
			this.background += '-portrait';
		}

		document.body.setBackground(this.background);

		this.Auth.init(this);
	},

	watch: {
		'background': function(newValue, oldValue) {
			document.body.setBackground(newValue);
		}
	},

	methods: {
		logout() {
			this.$http.get('/logout')
				.then(response => {
					this.Auth.user = false;
					this.$router.go('/');
				});
		},
	}
});

var router = new VueRouter();

router.map({
  	'/': {
    	component: App.component('hey', require('./pages/hey.vue')),
  	},
  	'middle-name': {
  		component: App.component('middle-name', require('./pages/middle-name.vue')),
  	},
  	'came-back-for': {
  		component: App.component('came-back-for', require('./pages/came-back-for.vue')),
  	},
  	'shook-a-little': {
  		component: App.component('shook-a-little', require('./pages/shook-a-little.vue')),
  	},
  	'tell-me': {
  		component: App.component('tell-me', require('./pages/tell-me.vue')),
  	},
  	'wait-for-me': {
  		component: App.component('wait-for-me', require('./pages/wait-for-me.vue')),
  	},
  	'its-me-isabell': {
  		component: App.component('its-me-isabell', require('./pages/its-me-isabell.vue')),
  	},
  	'notebook': {
  		component: App.component('notebook', require('./pages/notebook.vue')),
  	}
});

router.start(App, '#app');