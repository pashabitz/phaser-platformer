import { Scene } from "phaser";

export class BaseLevel extends Scene {
    constructor(key) {
        super(key);
        this.score = 0;
        this.scoreText = null;
        this.gameOver = false;
    }


    restartGame() {
        this.scene.start(this.key);
        this.gameOver = false;
    }

    addBomb() {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        const velocityX = Phaser.Math.Between(0, 1) === 0
            ? Phaser.Math.Between(-200, -100)
            : Phaser.Math.Between(100, 200);
        bomb.setVelocity(velocityX, 20);
    }
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        this.generateNewStars();
    }
    generateNewStars() {
        if (this.stars.countActive(true) === 0) {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            this.addBomb();
        }
    }
    makeMovingPlatform(x, y, speed, offset) {
        const movingPlatform = this.physics.add.image(x, y, 'ground');
        movingPlatform.setImmovable(true);
        movingPlatform.body.allowGravity = false;
        movingPlatform.setVelocityX(speed); // Initial velocity

        this.tweens.add({
            targets: movingPlatform,
            x: movingPlatform.x + offset, // Move 200 pixels to the right
            duration: 3000, // 3 seconds
            ease: 'Linear',
            yoyo: true, // Go back and forth
            repeat: -1, // Repeat indefinitely
            onYoyo: () => { movingPlatform.setVelocityX(-speed); }, // Reverse velocity on yoyo
            onRepeat: () => { movingPlatform.setVelocityX(speed); } // Reset velocity on repeat
        });
        return movingPlatform;
    }

    hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }
    hitSpikes(player, spikes) {
        this.physics.pause();

        player.setTint(0x00ff00);

        player.anims.play('turn');

        this.gameOver = true;
    }

    create() {
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.cameras.main.setBounds(0, 0, 1600, 600);

        this.bombs = this.physics.add.group();

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.addBomb();

        this.platforms = this.physics.add.staticGroup();
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);

        this.cameras.main.startFollow(this.player);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', this.restartGame, this);

    }

    update() {
        if (this.gameOver) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-280);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(280);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350);
        }
    }
}