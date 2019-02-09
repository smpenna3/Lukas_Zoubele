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
}

function create(){
    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(450, 450, 'car');
    player.setScale(0.05);
    player.setCollideWorldBounds(true);
}

function update(){
    if(cursors.up.isDown && cursors.right.isDown){
        player.setVelocityY(-velocity);
        player.setVelocityX(velocity);
        player.rotation = -0.79;
    }
    else if(cursors.up.isDown && cursors.left.isDown){
        player.setVelocityY(-velocity);
        player.setVelocityX(-velocity);
        player.rotation = -2.36;
    }
    else if(cursors.down.isDown && cursors.right.isDown){
        player.setVelocityY(velocity);
        player.setVelocityX(velocity);
        player.rotation = 0.79;
    }
    else if(cursors.down.isDown && cursors.left.isDown){
        player.setVelocityY(velocity);
        player.setVelocityX(-velocity);
        player.rotation = 2.36;
    }
    else if (cursors.up.isDown){
        player.setVelocityY(-velocity);
        player.setVelocityX(0);
        player.rotation = -1.57;
    }
    else if (cursors.down.isDown){
        player.setVelocityY(velocity);
        player.setVelocityX(0);
        player.rotation = 1.57;
    }
    else if (cursors.left.isDown){
        player.setVelocityX(-velocity);
        player.setVelocityY(0);
        player.rotation = 3.14;
    }
    else if (cursors.right.isDown){
        player.setVelocityX(velocity);
        player.setVelocityY(0);
        player.rotation = 0;
    }

    else{
        player.setVelocityX(0);
        player.setVelocityY(0);
    }

    socket.emit('moved', {x:player.x, y:player.y});
}

socket.on('playerMoved', function(playerInfo){
    otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
    });
})