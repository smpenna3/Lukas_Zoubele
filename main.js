var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var port = 7845

var io = require('socket.io').listen(server);

var players = {};

const SHA256 = require('crypto-js/sha256');

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

class Block {
	constructor(timestamp, data) {
		this.index = 0;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = "0";
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + this.data + this.nonce).toString();
	}

	mineHash(difficulty) {

	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesis()];
	}

	createGenesis() {
		return new Block(0, "01/01/2017", "Genesis block", "0");
	}

	latestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.latestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	checkValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}

		return true;
	}
}

let jsChain = new Blockchain();
jsChain.addBlock(new Block("12/25/2017", {amount: 5}));
jsChain.addBlock(new Block("12/26/2017", {amount: 10}));

console.log(JSON.stringify(jsChain, null, 4));
console.log("Is blockchain valid? " + jsChain.checkValid());
