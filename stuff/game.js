var velocity = 300;

var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
        debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var socket = io();

otherPlayers = game.scene.scenes[0].physics.add.group();

socket.on('currentPlayers', function(players){
    Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
        } else {
          addOtherPlayers(self, players[id]);
        }
    });
});

socket.on('newPlayer', function(player){
    addOtherPlayers(self, player);
    console.log('adding new player');
});

socket.on('disconnect', function(player){
    otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
    });
});


// game.scene.scenes[0].physics
function addOtherPlayers(){
    enemy = game.scene.scenes[0].physics.add.image(200, 200, 'car');
    enemy.setScale(0.05);
    enemy.setCollideWorldBounds(true);

    otherPlayers.add(enemy);
}

function preload(){
    this.load.image('car', 'car.png');
    this.load.image('otherCar', 'car.png');
}

function create(){
    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    this.socket.on('currentPlayers', function(players) {
        Object.keys(players).forEach(function(id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]);
            } else {
                addOtherPlayers(self, players[id]);
            }
        });
    });
    this.socket.on('newPlayer', function(playerInfo) {
        addOtherPlayers(self, playerInfo);
    });
    this.socket.on('disconnect', function(playerId) {
        self.otherPlayers.getChildren().forEach(function(otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });
    this.socket.on('playerMoved', function(playerInfo) {
        self.otherPlayers.getChildren().forEach(function(otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setRotation(playerInfo.rotation);
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });
    this.cursors = this.input.keyboard.createCursorKeys();
}

function addPlayer(self, playerInfo) {
    self.car = self.physics.add.image(playerInfo.x, playerInfo.y, 'car').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    self.car.setScale(0.05);
    self.car.setCollideWorldBounds(true);
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherCar').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    otherPlayer.setScale(0.05);
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}

function update(){
    if (this.car) {
        if (this.cursors.left.isDown) {
            this.car.setAngularVelocity(-150);
        } else if (this.cursors.right.isDown) {
            this.car.setAngularVelocity(150);
        } else {
            this.car.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(this.car.rotation + 1.5, 100, this.car.body.acceleration);
        } else {
            this.car.setAcceleration(0);
        }

        this.physics.world.wrap(this.car, 5);

        var x = this.car.x;
        var y = this.car.y;
        var r = this.car.rotation;
        if (this.car.oldPosition && (x !== this.car.oldPosition.x || y !== this.car.oldPosition || r !== this.car.oldPosition.rotation)) {
            this.socket.emit('playerMovement', { x: this.car.x, y: this.car.y, rotation: this.car.rotation });
        }

        this.car.oldPosition = {
            x: this.car.x,
            y: this.car.y,
            rotation: this.car.rotation
        };
    }
    // if(cursors.up.isDown && cursors.right.isDown){
    //     player.setVelocityY(-velocity);
    //     player.setVelocityX(velocity);
    //     player.rotation = -0.79;
    // }
    // else if(cursors.up.isDown && cursors.left.isDown){
    //     player.setVelocityY(-velocity);
    //     player.setVelocityX(-velocity);
    //     player.rotation = -2.36;
    // }
    // else if(cursors.down.isDown && cursors.right.isDown){
    //     player.setVelocityY(velocity);
    //     player.setVelocityX(velocity);
    //     player.rotation = 0.79;
    // }
    // else if(cursors.down.isDown && cursors.left.isDown){
    //     player.setVelocityY(velocity);
    //     player.setVelocityX(-velocity);
    //     player.rotation = 2.36;
    // }
    // else if (cursors.up.isDown){
    //     player.setVelocityY(-velocity);
    //     player.setVelocityX(0);
    //     player.rotation = -1.57;
    // }
    // else if (cursors.down.isDown){
    //     player.setVelocityY(velocity);
    //     player.setVelocityX(0);
    //     player.rotation = 1.57;
    // }
    // else if (cursors.left.isDown){
    //     player.setVelocityX(-velocity);
    //     player.setVelocityY(0);
    //     player.rotation = 3.14;
    // }
    // else if (cursors.right.isDown){
    //     player.setVelocityX(velocity);
    //     player.setVelocityY(0);
    //     player.rotation = 0;
    // }
    //
    // else{
    //     player.setVelocityX(0);
    //     player.setVelocityY(0);
    // }
}
