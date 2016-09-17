var fs = require('fs');
var path = require('path');
var express = require(modulePath('express'));
var app = express();
var bodyParser = require(modulePath('body-parser'));
var mongodb = require(modulePath('mongodb'));
var mongoClient = mongodb.MongoClient;

app.use(express.static(__dirname));
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
}

// Routes
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

function modulePath(module) {
	var	modulePath;
	try {
		modulePath = '../node_modules/' + module + '/index.js';
	  	fs.statSync(modulePath);
	} catch(e) {
	  	try {
	  		modulePath = '../node_modules/' + module + '/bin/' + module + '.js';
	      	fs.statSync(transcriptionDirectory);
	    } catch(e) {
	      	modulePath = '../node_modules/' + module + '/bin/' + module;
	    }
	}

	return modulePath;
}


