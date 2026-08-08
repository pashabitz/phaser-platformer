import { Physics } from 'phaser';

export class Player extends Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dude');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.isFlying = false;
        this.isScuba = false;
        this.movementDirection = 'right';
        this.cursors = scene.input.keyboard.createCursorKeys();

        this.createAnimations();
    }

    createAnimations() {
        if (!this.scene.anims.exists('left')) {
            this.scene.anims.create({
                key: 'left',
                frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('turn')) {
            this.scene.anims.create({
                key: 'turn',
                frames: [{ key: 'dude', frame: 4 }],
                frameRate: 20
            });
        }

        if (!this.scene.anims.exists('right')) {
            this.scene.anims.create({
                key: 'right',
                frames: this.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            this.setVelocityX(-280);
            this.movementDirection = 'left';
            if (!this.isScuba) {
                this.anims.play('left', true);
            } else {
                this.flipX = true;
            }
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(280);
            this.movementDirection = 'right';
            if (!this.isScuba) {
                this.anims.play('right', true);
            } else {
                this.flipX = false;
            }
        }
        else {
            this.setVelocityX(0);

            if (!this.isScuba) {
                this.anims.play('turn');
            }
        }

        if (this.cursors.up.isDown && (this.body.touching.down || this.isFlying)) {
            this.setVelocityY(-350);
        }
    }

    equipScuba() {
        this.setTexture('dude_with_scuba')
            .setScale(0.05)
            .refreshBody();
        this.body.setSize(800, 800);
        this.body.setOffset(100, 100);
        this.anims.stop();
        this.isScuba = true;
    }

    resetAbilities() {
        this.isFlying = false;
        this.isScuba = false;
    }

    die(color) {
        if (this.isScuba) {
            this.setTexture('dude').setScale(1).refreshBody();
            this.body.setSize(32, 48);
            this.body.setOffset(0, 0);
            this.x -= 100;
            this.y -= 100;
        }

        this.setTint(color);
        this.anims.play('turn');
        this.resetAbilities();
    }
}