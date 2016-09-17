var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

// Connect to MongoDB
mongoClient.connect('mongodb://localhost:27017/isabell', startServer);

function startServer(error, db) {
	if (error) {
  		throw error;
	}

	var server = app.listen(8080);

	// var server = http.createServer(app);
	var io = require('socket.io').listen(server);

	// Socket events
	io.on('connection', function (socket) {
		db.collection('messages').find().toArray(function(error, messages) {
			socket.emit('connected', {messages: messages});
		});

	  	socket.on('new-message', function (message) {
			db.collection('messages').insert(message, function(error, result) {
				if (error) {
					console.log(error);
					return;
				}
				io.sockets.emit('message-saved', message);
			});
	  	});

	  	socket.on('remove-message', function(message) {
	  		db.collection('messages').deleteOne({ _id: new mongodb.ObjectID(message._id) }, function(error, result) {
	  			if (error) {
					console.log(error);
					return;
				}
	  			io.sockets.emit('message-removed', message);
	  		});
	  	});
	});

	
	// db.collection('messages').find().toArray(function(err, result) {
	//   	if (err) {
	//       throw err;
	//   	}
	//   	console.log(result);
	// });
}

// Routes
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


