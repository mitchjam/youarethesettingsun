<template>
	<div class="wrapper flex columns" v-cloak>
		<!-- <div class="logout flex">
			<h2 @click="logout()" class="glyphicon glyphicon-chevron-left clickable"></h2>
			<h4 @click="logout()" class="monoton clickable">Logout</h4>
		</div> -->

		<div class="flex space-btw notebook">

			<div class="flex note-list columns" v-cloak>

				<div v-for="message in messages" class="flex space-btw clickable">
					<p @click.prevent="getMessage(message)" class="note-link">{{ message.message }}</p>
					<span @click="removeMessage(message)" class="close glyphicon glyphicon-remove"></span>
				</div>

			</div>
		
			
			<div class="flex columns new-note">
				<h2 class="full new-note-field">
					<textarea class="full high" v-model="newMessage" placeholder="Tell me more..."></textarea>
				</h2>
				
				<div @click="sendMessage()" class="next flex">
					<h2 class="glyphicon glyphicon-chevron-right"></h2>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	module.exports = {
		props: ['Auth', 'background'],

		data() {
			return {
				socket: null,
				newMessage: '',
				messages: [],
			};
		},

		created() {
			this.Auth.check();
		},

		ready() {
			this.$http.get('/server')
				.then(response => {
					var server = JSON.parse(response.data);
					this.socket = io.connect(server.domain + ':' + server.port);
					})
				.then(() => {
					this.registerSocketEvents();
					});
		},

		methods: {
			sendMessage() {
				if (this.newMessage.trim().length == 0) {
					return;
				}

				this.socket.emit('new-message', {message: this.newMessage});
			},

			getMessage(message) {
				this.newMessage = message.message;
			},

			removeMessage(message) {
				this.socket.emit('remove-message', message);
			},

			registerSocketEvents() {
				this.socket.on('connected', data => {
					this.messages = data.messages;
				});

				this.socket.on('message-saved', message => {
					this.messages.push(message);
					this.newMessage = '';
				});

				this.socket.on('message-removed', removedMessage => {
					var message = this.messages.find(message => {
						return message._id == removedMessage._id;
					});
					this.messages.$remove(message);
				});
			},
		}
	};
</script>