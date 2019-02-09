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

function preload(){
    this.load.image('car', 'grnline.png');
    this.load.image('otherCar', 'grnline.png');
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
    self.car = self.physics.add.image(playerInfo.x, playerInfo.y, 'car');
    self.car.setCollideWorldBounds(true);
    self.car.setDrag(100);
    self.car.setAngularDrag(100);
    self.car.setMaxVelocity(200);
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherCar');
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
            this.physics.velocityFromRotation(this.car.rotation, 100, this.car.body.acceleration);
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
