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
    this.load.image('car', 'car.png');
}

function create(){
    player = this.physics.add.image(450, 450, 'car');
    player.setScale(0.05);
    player.setCollideWorldBounds(true);
    //this.cameras.main.startFollow(player, true);
    cursors = this.input.keyboard.createCursorKeys();
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
}