import { Scene } from "phaser";
import { Bombs } from '../objects/bombs';
import { Player } from '../objects/player';

export class BaseLevel extends Scene {
    constructor(key) {
        super(key);
        this.scoreText = null;
        this.gameOver = false;
    }

    restartGame() {
        this.scene.start(this.scene.key);
        this.gameOver = false;
    }

    collectStar(player, star) {
        this.sound.play('collect_coin');
        star.disableBody(true, true);
        this.registry.score += 10;
        this.scoreText.setText('Score: ' + this.registry.score);

        if (this.stars.countActive(true) === 0) {
            this.moveToNextLevel();
        }
    }
    generateNewStars() {
        if (this.stars.countActive(true) === 0) {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            this.bombs.add();
        }
    }
    moveToNextLevel() {
        const levelNumber = this.scene.key.replace('Level', '');
        const nextLevelNumber = parseInt(levelNumber) + 1;
        const nextLevelKey = `Level${nextLevelNumber}`;
        if (this.scene.get(nextLevelKey)) {
            this.scene.start(nextLevelKey);
        } else {
            console.log('No more levels available.');
        }
    }
    makeMovingPlatform(x, y, speed, offset, xScale = 1) {
        const movingPlatform = this.physics.add.image(x, y, 'ground');
        movingPlatform.setImmovable(true);
        movingPlatform.body.allowGravity = false;
        movingPlatform.setVelocityX(speed); // Initial velocity
        movingPlatform.setScale(xScale, 1); // Scale the platform
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

    createMovingPlatforms(movingPlatformConfigs = []) {
        this.movingPlatforms = movingPlatformConfigs.map(({ x, y, speed, offset, xScale = 1 }) => (
            this.makeMovingPlatform(x, y, speed, offset, xScale)
        ));
    }

    generateStars(numStars, stepX) {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: numStars,
            setXY: { x: 12, y: 0, stepX }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });
    }

    doGameOver() {
        this.gameOver = true;
        this.player.resetAbilities();
        this.registry.score = 0;
    }
    dieAndTurnColor(player, color) {
        this.physics.pause();
        player.die(color);

        if (this.dino?.attached) {
            this.dino.tint(color);
        }

        this.sound.play('death');

        this.doGameOver();
    }
    hitSpikes(player, spikes) {
        this.dieAndTurnColor(player, 0x00ff00);
    }
    hitWater(player, water) {
        this.dieAndTurnColor(player, 0x0000ff);
    }

    createPlatforms(platformConfigs = []) {
        this.platforms = this.physics.add.staticGroup();

        platformConfigs.forEach(({ x, y, key = 'ground', scaleX = 1, scaleY = 1 }) => {
            this.platforms.create(x, y, key).setScale(scaleX, scaleY).refreshBody();
        });
    }

    createSpikes(spikeConfigs = []) {
        this.spikes = this.physics.add.staticGroup();

        spikeConfigs.forEach(({ x, y, key = 'spikes', depth = -1 }) => {
            this.spikes.create(x, y, key).setDepth(depth);
        });
    }

    create({ platforms = [], spikes = [], movingPlatforms = [] } = {}) {
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.cameras.main.setBounds(0, 0, 1600, 600);

        this.player = new Player(this, 100, 450);


        this.createPlatforms(platforms);
        this.bombs = new Bombs(this, this.player, this.platforms);
        this.bombs.add();
        this.generateStars(15, 90);
        this.createSpikes(spikes);
        this.createMovingPlatforms(movingPlatforms);


        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.movingPlatforms.forEach((movingPlatform) => {
            this.physics.add.collider(this.player, movingPlatform);
            this.physics.add.collider(this.stars, movingPlatform);
        });
        this.physics.add.overlap(this.spikes, this.stars, (spike, star) => {
            star.disableBody(true, true);
        }, null, this);
        this.physics.add.collider(this.player, this.spikes, this.hitSpikes, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);


        this.scoreText = this.add.text(16, 16, 'Score: ' + this.registry.score, { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);

        this.cameras.main.startFollow(this.player);

        this.input.on('pointerdown', this.restartGame, this);

    }

    update() {
        if (this.gameOver) {
            return;
        }
        if (this.dino?.update()) {
            return;
        }
        this.player.update();
    }
}