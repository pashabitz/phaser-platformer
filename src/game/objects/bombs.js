export class Bombs {
    constructor(scene, player, platforms) {
        this.scene = scene;
        this.player = player;
        this.group = scene.physics.add.group();

        scene.physics.add.collider(player, this.group, this.hitPlayer, null, this);
        scene.physics.add.collider(this.group, platforms);
    }

    add() {
        const x = this.player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        const bomb = this.group.create(x, 16, 'bomb');
        const velocityX = Phaser.Math.Between(0, 1) === 0
            ? Phaser.Math.Between(-200, -100)
            : Phaser.Math.Between(100, 200);

        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(velocityX, 20);
    }

    hitPlayer(player) {
        this.scene.dieAndTurnColor(player, 0xff0000);
    }
}