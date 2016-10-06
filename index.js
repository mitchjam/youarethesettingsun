var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var nodemailer = require('nodemailer');
var session = require('express-session');

var env = require('./.env.js');

app.use(express.static(__dirname + '/public'));
app.use(session({
  genid: function(req) {
    return Math.random().toString(36).substring(7);
  },
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Routes

// This route is for a SPA with browser pushState
// 
// app.get('*', function(request, response){
//   	response.sendfile('./public/index.html');
// });

app.get('/', function (request, response) {
	response.sendFile(__dirname + '/public/index.html');
});

app.post('/api/its-me-isabell', function(request, response) {
	mongoClient.connect('mongodb://localhost:27017/isabell', function(error, db) {
		if (error) {
	  		throw error;
		}
		db.collection('users').findOne({username: request.body.username, password: request.body.password, authorized: true}, function(error, result) {
			if (error || ! result) {
				response.sendStatus(403);
				return;
			}
			request.session.loggedIn = true;
			response.sendStatus(200);
		});
	});
});

app.get('/logout', function(request, response) {
	request.session.loggedIn = false;
	response.sendStatus(200);
});

app.get('/loggedIn', function(request, response) {
	request.session.loggedIn ? response.sendStatus(200) : response.sendStatus(403);
});

app.get('/server', function(request, response) {
	response.send(JSON.stringify(env));
});

app.post('/api/middle-name', function(request, response) {
	if (request.body.middleName.toLowerCase() == 'grace' 
		|| request.body.middleName.toLowerCase() == 'its me isabell'
		|| request.body.middleName.toLowerCase() == 'it\'s me isabell') {
		request.session.middleName = true;
		response.sendStatus(200);
		return;
	}
	response.sendStatus(403);
});

app.post('/auth/middle-name', function(request, response) {
	return request.session.middleName ? response.sendStatus(200) : response.sendStatus(403);
});

app.post('/api/came-back-for', function(request, response) {
	if (request.body.cameBackFor.toLowerCase() == 'email') {
		request.session.cameBackFor = true;
		response.sendStatus(200);
		return;
	}
	response.sendStatus(403);
});

app.post('/auth/came-back-for', function(request, response) {
	return request.session.cameBackFor ? response.sendStatus(200) : response.sendStatus(403);
});

app.post('/api/shook-a-little', function(request, response) {
	if (request.body.shookALittle.toLowerCase() == 'shook a little turd' ||
		request.body.shookALittle.toLowerCase() == 'shook a little terd') 
	{
		request.session.shookALittle = true;
		response.sendStatus(200);
		return;
	}

	response.sendStatus(403);
});

app.post('/auth/shook-a-little', function(request, response) {
	return request.session.shookALittle ? response.sendStatus(200) : response.sendStatus(403);
});

app.post('/api/tell-me', function(request, response) {	
	if (! request.body.text || ! request.body.text.length) {
		response.sendStatus(403);
		return;
	} 

	// setup e-mail data with unicode symbols 
	var mailOptions = {
	    from: 'You are the setting sun.', // sender address 
	    to: '7166971859@vtext.com', // list of receivers 
	    subject: 'Isabell', // Subject line 
	    text: request.body.text, // plaintext body 
	};

	 var transporter = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: "mitchjam1928@gmail.com",
            pass: "msfgunorugqrldgw"
        }
    });
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	    	response.sendStatus(500);
	        return;
	    }
	    request.session.tellMe = true;
	    response.sendStatus(200);
	});
});

app.post('/auth/tell-me', function(request, response) {	
	return request.session.tellMe ? response.sendStatus(200) : response.sendStatus(403);
});

app.post('/api/wait-for-me', function(request, response) {
	mongoClient.connect('mongodb://localhost:27017/isabell', function(error, db) {
		if (error) {
	  		throw error;
		}
		db.collection('users').insertOne({username: request.body.username, password: request.body.password}, function(error, result) {
			if (error) {
				response.sendStatus(500);
				return;
			}
			response.sendStatus(200);
		});
	});
});
// End Routes


// Connect to MongoDB
mongoClient.connect('mongodb://localhost:27017/isabell', startServer);

function startServer(error, db) {
	if (error) {
  		throw error;
	}

	var server = app.listen(env.port);

	var io = require('socket.io').listen(server);

	// Socket events
	io.on('connection', function (socket) {
		db.collection('messages').find().toArray(function(error, messages) {
			socket.emit('connected', {messages: messages});
		});

	  	socket.on('new-message', function (message) {
			db.collection('messages').insertOne(message, function(error, result) {
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
};

