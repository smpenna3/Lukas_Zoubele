var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var port = 7845

var io = require('socket.io').listen(server);

var players = {};

app.use(express.static('assets'));
app.use(express.static('stuff'));

server.listen(process.env.PORT || port, function() {
	console.log(`Example app listening on port ${port}!`);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));

io.on('connection', function(socket) {
	console.log('a user connected');
	players[socket.id] = {
		rotation: 0,
		x: Math.floor(Math.random() * 800) + 50,
		y: Math.floor(Math.random() * 500) + 50,
		playerId: socket.id
	};
	socket.emit('currentPlayers', players);
	socket.broadcast.emit('newPlayer', players[socket.id]);
	socket.on('disconnect', function() {
		console.log('a user disconnected');
		delete players[socket.id];
		io.emit('disconnect', socket.id);
	});
	socket.on('playerMovement', function(movementData) {
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		players[socket.id].rotation = movementData.rotation;
		socket.broadcast.emit('playerMoved', players[socket.id]);
	});
});
