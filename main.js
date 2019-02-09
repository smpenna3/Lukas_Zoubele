var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var port = 7845

var io = require('socket.io').listen(server);

app.use(express.static('assets'));
app.use(express.static('stuff'));

server.listen(process.env.PORT || port, function() {
	console.log(`Example app listening on port ${port}!`);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));


///////////////////// PLAYERS
var players = {}

io.on('connection', function(socket){
    console.log('Adding user');
    players[socket.id] = {
        playerId: socket.id,
    };
    /*
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
    */

    socket.on('disconnect', function(){
        console.log('Removing user');
        delete players[socket.id];
        io.emit('disconnect', socket.id);
    });

    socket.on('moved', function(data){
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        //console.log('moved')

        socket.broadcast.emit('playerMoved', players[socket.id]);
    })
});