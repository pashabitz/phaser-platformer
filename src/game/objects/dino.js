export class Dino {
    constructor(scene) {
        this.scene = scene;
        this.sprite = null;
        this.attached = false;
    }

    create(x, y, character = 0) {
        if (!Number.isInteger(character) || character < 0 || character > 7) {
            throw new RangeError('Dino character must be an integer from 0 to 7.');
        }

        const directions = ['down', 'left', 'right', 'up'];
        directions.forEach((dinoDirection, row) => {
            const animationKey = `dino-${character}-${dinoDirection}`;
            const frameStart = (Math.floor(character / 4) * 4 + row) * 12 + (character % 4) * 3;
            if (!this.scene.anims.exists(animationKey)) {
                this.scene.anims.create({
                    key: animationKey,
                    frames: this.scene.anims.generateFrameNumbers('dinos', {
                        start: frameStart,
                        end: frameStart + 2
                    }),
                    frameRate: 6,
                    repeat: -1
                });
            }
        });

        this.sprite = this.scene.physics.add.sprite(x, y, 'dinos');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.dinoCharacter = character;
        this.sprite.idleFrame = Math.floor(character / 4) * 48 + (character % 4) * 3;
        this.sprite.patrolLeft = x - 200;
        this.sprite.patrolRight = x;
        this.sprite.setVelocityX(-200);
        this.sprite.anims.play(`dino-${character}-left`, true);
        this.scene.physics.add.collider(this.sprite, this.scene.platforms);
        this.scene.physics.add.overlap(this.scene.player, this.sprite, () => this.attach());

        return this;
    }

    addInteractions(wall, spikes, stars) {
        wall.addDino(this);
        this.scene.physics.add.collider(this.sprite, spikes, (dino, hitSpikes) => {
            if (this.attached) {
                this.scene.hitSpikes(this.scene.player, hitSpikes);
            }
        });
        this.scene.physics.add.overlap(this.sprite, stars, (dino, star) => {
            if (this.attached) {
                this.scene.collectStar(this.scene.player, star);
            }
        });
    }

    attach() {
        if (this.attached) {
            return;
        }

        this.attached = true;
        this.sprite.setVelocity(0, 0);
        this.sprite.canJump = true;
        this.sprite.hasLeftGround = false;
        this.scene.player.body.setAllowGravity(false);
        this.scene.player.setVelocity(0, 0);
    }

    update() {
        if (!this.attached) {
            this.updatePatrol();
            return false;
        }

        this.updateAttached();
        return true;
    }

    updatePatrol() {
        if (this.sprite.x <= this.sprite.patrolLeft) {
            this.sprite.setVelocityX(200);
            this.sprite.anims.play(`dino-${this.sprite.dinoCharacter}-right`, true);
        }
        else if (this.sprite.x >= this.sprite.patrolRight) {
            this.sprite.setVelocityX(-200);
            this.sprite.anims.play(`dino-${this.sprite.dinoCharacter}-left`, true);
        }
    }

    updateAttached() {
        let velocityX = 0;
        if (this.scene.cursors.left.isDown) {
            velocityX = -280;
            this.scene.player.anims.play('left', true);
            this.sprite.anims.play(`dino-${this.sprite.dinoCharacter}-left`, true);
        }
        else if (this.scene.cursors.right.isDown) {
            velocityX = 280;
            this.scene.player.anims.play('right', true);
            this.sprite.anims.play(`dino-${this.sprite.dinoCharacter}-right`, true);
        }
        else {
            this.scene.player.anims.play('turn');
            this.sprite.anims.stop();
            this.sprite.setFrame(this.sprite.idleFrame);
        }

        this.sprite.setVelocityX(velocityX);
        const isGrounded = this.sprite.body.onFloor();
        if (!isGrounded) {
            this.sprite.hasLeftGround = true;
        }
        if (!this.sprite.canJump && this.sprite.hasLeftGround && isGrounded) {
            this.sprite.canJump = true;
            this.sprite.hasLeftGround = false;
        }
        if (this.scene.cursors.up.isDown && isGrounded && this.sprite.canJump) {
            this.sprite.canJump = false;
            this.sprite.setVelocityY(-350);
        }
        this.scene.player.setPosition(
            this.sprite.x,
            this.sprite.y - (this.sprite.displayHeight + this.scene.player.displayHeight) / 2 + 4
        );
    }

    tint(color) {
        this.sprite.anims.stop();
        this.sprite.setFrame(this.sprite.idleFrame);
        this.sprite.setTint(color);
    }
}