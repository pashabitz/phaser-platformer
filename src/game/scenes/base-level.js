import { Scene } from "phaser";

export class BaseLevel extends Scene {
    constructor(key) {
        super(key);
        this.scoreText = null;
        this.gameOver = false;
        this.isFlying = false;
        this.isScuba = false;
    }

    createDinoNpc(x, y, character = 0, direction = 'down') {
        if (!Number.isInteger(character) || character < 0 || character > 7) {
            throw new RangeError('Dino character must be an integer from 0 to 7.');
        }

        const directions = ['down', 'left', 'right', 'up'];
        const directionRow = directions.indexOf(direction);

        if (directionRow === -1) {
            throw new RangeError(`Dino direction must be one of: ${directions.join(', ')}.`);
        }

        directions.forEach((dinoDirection, row) => {
            const animationKey = `dino-${character}-${dinoDirection}`;
            const frameStart = (Math.floor(character / 4) * 4 + row) * 12 + (character % 4) * 3;

            if (!this.anims.exists(animationKey)) {
                this.anims.create({
                    key: animationKey,
                    frames: this.anims.generateFrameNumbers('dinos', {
                        start: frameStart,
                        end: frameStart + 2
                    }),
                    frameRate: 6,
                    repeat: -1
                });
            }
        });

        const npc = this.physics.add.sprite(x, y, 'dinos');
        npc.setCollideWorldBounds(true);
        npc.dinoCharacter = character;
        npc.idleFrame = Math.floor(character / 4) * 48 + (character % 4) * 3;
        npc.mode = 'patrolling';
        npc.patrolLeft = x - 200;
        npc.patrolRight = x;
        npc.setVelocityX(-200);
        npc.anims.play(`dino-${character}-left`, true);
        this.physics.add.collider(npc, this.platforms);
        this.dinoNpcs = this.dinoNpcs || [];
        this.dinoNpcs.push(npc);

        return npc;
    }

    updateDinoNpcs() {
        if (!this.dinoNpcs) {
            return;
        }

        this.dinoNpcs.forEach((dino) => {
            if (dino.mode !== 'patrolling') {
                return;
            }

            if (dino.x <= dino.patrolLeft) {
                dino.setVelocityX(200);
                dino.anims.play(`dino-${dino.dinoCharacter}-right`, true);
            }
            else if (dino.x >= dino.patrolRight) {
                dino.setVelocityX(-200);
                dino.anims.play(`dino-${dino.dinoCharacter}-left`, true);
            }
        });
    }

    attachPlayerToDino(player, dino) {
        if (dino.mode === 'attached') {
            return;
        }

        dino.mode = 'attached';
        dino.setVelocity(0, 0);
        dino.canJump = true;
        dino.hasLeftGround = false;
        player.body.setAllowGravity(false);
        player.setVelocity(0, 0);
        this.attachedDino = dino;
    }

    updateAttachedDino() {
        if (!this.attachedDino) {
            return false;
        }

        const dino = this.attachedDino;
        let velocityX = 0;

        if (this.cursors.left.isDown) {
            velocityX = -280;
            this.player.anims.play('left', true);
            dino.anims.play(`dino-${dino.dinoCharacter}-left`, true);
        }
        else if (this.cursors.right.isDown) {
            velocityX = 280;
            this.player.anims.play('right', true);
            dino.anims.play(`dino-${dino.dinoCharacter}-right`, true);
        }
        else {
            this.player.anims.play('turn');
            if (dino.anims) dino.anims.stop();
            dino.setFrame(dino.idleFrame);
        }

        dino.setVelocityX(velocityX);
        //  onFloor() reads blocked.down, which only static bodies set. touching.down
        //  is unusable here: the player/dino overlap check also writes it mid-air.
        const isGrounded = dino.body.onFloor();
        if (!isGrounded) {
            dino.hasLeftGround = true;
        }
        if (!dino.canJump && dino.hasLeftGround && isGrounded) {
            dino.canJump = true;
            dino.hasLeftGround = false;
        }
        if (this.cursors.up.isDown && isGrounded && dino.canJump) {
            dino.canJump = false;
            dino.setVelocityY(-350);
        }
        this.player.setPosition(
            dino.x,
            dino.y - (dino.displayHeight + this.player.displayHeight) / 2 + 4
        );

        return true;
    }


    restartGame() {
        this.scene.start(this.scene.key);
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

            this.addBomb();
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
        this.isFlying = false;
        this.isScuba = false;
        this.registry.score = 0;
    }
    dieAndTurnColor(player, color) {
        this.physics.pause();

        if (this.isScuba) {
            player.setTexture('dude').setScale(1).refreshBody();
            player.body.setSize(32, 48);
            player.body.setOffset(0, 0);
            // 100,100 is the offset of the dude with scuba texture
            player.x -= 100;
            player.y -= 100;
        }

        player.setTint(color);

        player.anims.play('turn');

        if (this.attachedDino) {
            this.attachedDino.anims.stop();
            this.attachedDino.setFrame(this.attachedDino.idleFrame);
            this.attachedDino.setTint(color);
        }

        this.sound.play('death');

        this.doGameOver();
    }
    hitBomb(player, bomb) {
        this.dieAndTurnColor(player, 0xff0000);
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

    create({ platforms = [] } = {}) {
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.cameras.main.setBounds(0, 0, 1600, 600);

        this.bombs = this.physics.add.group();

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);


        // this.addBomb();

        this.createPlatforms(platforms);
        this.generateStars(15, 90);


        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);


        this.scoreText = this.add.text(16, 16, 'Score: ' + this.registry.score, { fontSize: '32px', fill: '#000' })
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
        this.updateDinoNpcs();
        if (this.updateAttachedDino()) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-280);
            this.player.movementDirection = "left";
            if (!this.isScuba) {
                this.player.anims.play('left', true);
            } else {
                this.player.flipX = true;
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(280);
            this.player.movementDirection = "right";
            if (!this.isScuba) {
                this.player.anims.play('right', true);
            } else {
                this.player.flipX = false;
            }
        }
        else {
            this.player.setVelocityX(0);

            if (!this.isScuba) {
                this.player.anims.play('turn');
            }
        }

        if (this.cursors.up.isDown && (this.player.body.touching.down || this.isFlying)) {
            this.player.setVelocityY(-350);
        }
    }
}