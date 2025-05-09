import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
        this.score = 0;
        this.scoreText = null;
        this.gameOver = false;
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');

        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('spikes', 'assets/spikes.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );

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
        // bomb.allowGravity = false;
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
        const platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(6, 2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        // platforms.create(750, 180, 'ground');
        platforms.create(1200, 320, 'ground');

        // Create a moving platform
        const movingPlatform = this.physics.add.image(750, 180, 'ground');
        movingPlatform.setImmovable(true);
        movingPlatform.body.allowGravity = false;
        movingPlatform.setVelocityX(50); // Initial velocity

        this.tweens.add({
            targets: movingPlatform,
            x: movingPlatform.x + 200, // Move 200 pixels to the right
            duration: 3000, // 3 seconds
            ease: 'Linear',
            yoyo: true, // Go back and forth
            repeat: -1, // Repeat indefinitely
            onYoyo: () => { movingPlatform.setVelocityX(-50); }, // Reverse velocity on yoyo
            onRepeat: () => { movingPlatform.setVelocityX(50); } // Reset velocity on repeat
        });

        const spikes = this.physics.add.staticGroup();
        spikes.create(600, 366, 'spikes').setDepth(-1);


        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

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


        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 15,
            setXY: { x: 12, y: 0, stepX: 90 }
        });

        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

        });


        this.bombs = this.physics.add.group();
        this.addBomb();

        this.physics.add.collider(this.bombs, platforms);


        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, movingPlatform);
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(spikes, this.stars, (spikes, star) => {
            star.disableBody(true, true);
        }, null, this);
        this.physics.add.collider(this.stars, movingPlatform);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

        this.input.on('pointerdown', this.restartGame, this);
    }

    restartGame() {
        this.scene.start('Boot');
        this.gameOver = false;
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
