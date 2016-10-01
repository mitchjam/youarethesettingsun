<template>
	<div  class="wrapper flex columns" v-cloak>
		<div class="content flex">

			<div class="list-group" v-cloak>

				<div v-for="message in messages" class="list-group-item">
					<span @click="removeMessage(message)" class="close glyphicon glyphicon-remove"></span>
					<span>{{ message.message }}</span>
				</div>

			</div>
		
			<form @submit.prevent="sendMessage()" class="form-inline">
				<div class="row">
					<div class="form-group col-sm-12">
						<div class="input-group col-sm-12">
		
							<input  type="text" v-model="newMessage" class="form-control" placeholder="What now?">
							<div @click.prevent="sendMessage()" class="input-group-addon bg-primary">Send</div>
		
						</div>
					</div>
				</div>
			</form>

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