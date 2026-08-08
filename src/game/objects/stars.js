export class Stars {
    constructor(scene, bombs) {
        this.scene = scene;
        this.bombs = bombs;
        this.group = null;
        this.scoreText = scene.add.text(16, 16, 'Score: ' + scene.registry.score, {
            fontSize: '32px',
            fill: '#000'
        }).setScrollFactor(0);
    }

    create(numStars, stepX) {
        this.group = this.scene.physics.add.group({
            key: 'star',
            repeat: numStars,
            setXY: { x: 12, y: 0, stepX }
        });

        this.group.children.iterate((star) => {
            star.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });

        return this;
    }

    add(x, y) {
        return this.group.create(x, y, 'star');
    }

    collect(star) {
        this.scene.sound.play('collect_coin');
        star.disableBody(true, true);
        this.scene.registry.score += 10;
        this.scoreText.setText('Score: ' + this.scene.registry.score);

        if (this.group.countActive(true) === 0) {
            this.scene.moveToNextLevel();
        }
    }

    generateNewBatch() {
        if (this.group.countActive(true) === 0) {
            this.group.children.iterate((star) => {
                star.enableBody(true, star.x, 0, true, true);
            });

            this.bombs.add();
        }
    }

    addColliders(platforms, movingPlatforms, spikes, player) {
        this.scene.physics.add.collider(this.group, platforms);
        movingPlatforms.forEach((movingPlatform) => {
            this.scene.physics.add.collider(this.group, movingPlatform);
        });
        this.scene.physics.add.overlap(spikes, this.group, (spike, star) => {
            star.disableBody(true, true);
        });
        this.scene.physics.add.overlap(player, this.group, (playerSprite, star) => {
            this.collect(star);
        });
    }
}