import { BaseLevel } from './base-level';

export class Level2 extends BaseLevel {
    constructor() {
        super('Level2');
    }

    preload() {
        // Jetpack asset is already loaded in the base scene preloader
    }


    create() {
        super.create();
        this.platforms.create(400, 568, 'ground').setScale(6, 2).refreshBody();

        this.platforms.create(150, 250, 'ground');
        this.platforms.create(700, 400, 'ground');
        this.platforms.create(1200, 250, 'ground');
        this.platforms.create(1700, 400, 'ground');

        // const movingPlatform = this.makeMovingPlatform(750, 180, 50, 200);



        const spikes = this.physics.add.staticGroup();
        spikes.create(590, 366, 'spikes').setDepth(-1);
        spikes.create(750, 366, 'spikes').setDepth(-1);


        this.generateStars(15, 90);



        // this.physics.add.collider(this.player, movingPlatform);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(spikes, this.stars, (spikes, star) => {
            star.disableBody(true, true);
        }, null, this);
        // this.physics.add.collider(this.stars, movingPlatform);
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

        this.createJetpack();

        // when the player is overlapping with the jetpack, attach it to the player
        this.physics.add.overlap(this.player, this.jetpack, this.attachJetpack, null, this);


    }

    createJetpack() {
        this.isJetpackAttached = false;
        // Create the jetpack sprite using proper jetpack asset
        this.jetpack = this.physics.add.sprite(this.player.x - 20, this.player.y, 'jetpack');
        this.jetpack.setScale(0.05); // Adjust scale as needed for this asset

        this.jetpack.body.setAllowGravity(false);
        // this.jetpack.body.setImmovable(true);

        // position the jetpack at 500,200
        this.jetpack.setPosition(1550, 360);
    }
    // Function to attach jetpack to player
    attachJetpack(player, jetpack) {
        if (this.isJetpackAttached) {
            return; // Jetpack is already attached
        }
        this.fuelRemaining = 100;
        this.isJetpackAttached = true;
        this.jetpackAttachedAt = new Date().getTime();
        this.isFlying = true;
        this.fuelText = this.add.text(16, 50, `Fuel: ${this.fuelRemaining}`, { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);

        // Set depth to be behind the player
        jetpack.setDepth(this.player.depth - 1);
        jetpack.body.enable = false;

        this.updateJetpackPosition();
        // Create a pulsing effect for the jetpack
        this.tweens.add({
            targets: this.jetpack,
            scale: { from: 0.05, to: 0.06 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    // Update jetpack position to follow player
    updateJetpackPosition() {
        if (this.jetpack) {
            // Position based on player direction
            const offsetX = this.player.movementDirection === 'left' ? 20 : -20; // Right or left of player
            const offsetY = 5; // Slight vertical offset

            this.jetpack.x = this.player.x + offsetX;
            this.jetpack.y = this.player.y + offsetY;

            // Flip the jetpack sprite when it's on the right side of the player
            this.jetpack.flipX = this.player.movementDirection === 'left'; // Flip when opposite of player direction

            // Update visual effect based on jetpack state
            if (this.jetpackActive && this.jetpackFuel > 0) {
                // Make jetpack more visible and animated when active
                this.jetpack.setAlpha(1);

                // Create flame effect below jetpack when active
                if (Math.random() > 0.3) { // Only create particles sometimes to avoid too many
                    this.createJetFlame();
                }
            } else {
                // More subtle when inactive
                this.jetpack.setAlpha(0.8);
            }
        } else {
            console.log('Jetpack not found');
        }
    }

    deactivateJetpack() {
        this.isFlying = false;
        this.jetpack.setAlpha(0.5); // Make jetpack less visible
        // stop the pulsing effect
        this.tweens.killTweensOf(this.jetpack);
    }

    // Create flame effect for the jetpack
    createJetFlame() {
        // Determine flame position based on jetpack orientation
        const flameOffsetX = 0; // Adjust based on jetpack sprite
        const flameOffsetY = 15; // Bottom of jetpack

        const emitX = this.jetpack.x + flameOffsetX;
        const emitY = this.jetpack.y + flameOffsetY;

        // Create flame particle
        const flame = this.add.circle(emitX, emitY, 6, 0xff3300);
        flame.setAlpha(0.7);

        // Animate the flame
        this.tweens.add({
            targets: flame,
            y: emitY + 30 + Math.random() * 20,
            alpha: 0,
            scale: 0.1,
            duration: 150 + Math.random() * 100,
            onComplete: () => flame.destroy()
        });
    }

    // Activate the jetpack
    activateJetpack() {
        if (this.jetpackFuel > 0) {
            // Apply upward force
            this.player.setVelocityY(-200);

            // Decrease fuel
            this.jetpackFuel = Math.max(0, this.jetpackFuel - 1);
            this.fuelText.setText(`Fuel: ${Math.floor(this.jetpackFuel)}%`);

            // Note: Particles are now created in the updateJetpackPosition method
            // when jetpackActive is true

            return true;
        }
        return false;
    }


    update() {
        super.update();

        if (!this.gameOver && this.isJetpackAttached) {
            // Update jetpack position to follow player
            this.updateJetpackPosition();

            if (this.fuelRemaining > 0) {
                const timeSinceAttached = new Date().getTime() - this.jetpackAttachedAt;
                this.fuelRemaining = Math.max(0, 100 - Math.floor(timeSinceAttached / 100));
                this.fuelText.setText(`Fuel: ${this.fuelRemaining}`);
                if (this.fuelRemaining <= 0) {
                    this.deactivateJetpack();
                }
            }

        }
    }
}
