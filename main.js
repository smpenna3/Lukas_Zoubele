var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var port = 7845

var io = require('socket.io')(server);

app.use(express.static('assets'));
app.use(express.static('stuff'));

server.listen(process.env.PORT || port, function() {
	console.log(`Example app listening on port ${port}!`);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));