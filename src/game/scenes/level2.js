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
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(1200, 250, 'ground');
        this.platforms.create(1700, 400, 'ground');

        // const movingPlatform = this.makeMovingPlatform(750, 180, 50, 200);

        

        const spikes = this.physics.add.staticGroup();
        spikes.create(490, 366, 'spikes').setDepth(-1);
        spikes.create(650, 366, 'spikes').setDepth(-1);


        // this.generateStars(15, 90);



        // this.physics.add.collider(this.player, movingPlatform);
        // this.physics.add.collider(this.stars, this.platforms);
        // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        // this.physics.add.overlap(spikes, this.stars, (spikes, star) => {
        //     star.disableBody(true, true);
        // }, null, this);
        // this.physics.add.collider(this.stars, movingPlatform);
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

        // // Attach the jetpack to the player
        // this.attachJetpack();
        
        // // Add space key for jetpack activation
        // this.spaceKey = this.input.keyboard.addKey('SPACE');
        
        // // Initialize jetpack fuel
        // this.jetpackFuel = 100;
        // this.jetpackActive = false;
        
        // // Add fuel text
        // this.fuelText = this.add.text(16, 50, 'Fuel: 100%', { fontSize: '32px', fill: '#000' })
        //     .setScrollFactor(0);
    }

    // Function to attach jetpack to player
    attachJetpack() {
        // Create the jetpack sprite using proper jetpack asset
        this.jetpack = this.add.sprite(this.player.x - 20, this.player.y, 'jetpack');
        this.jetpack.setScale(0.05); // Adjust scale as needed for this asset
        
        // Set the origin point to align with the player
        this.jetpack.setOrigin(0.5, 0.5);
        
        // Set depth to be behind the player
        this.jetpack.setDepth(this.player.depth - 1);
        
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
            const offsetX = this.player.flipX ? 20 : -20; // Right or left of player
            const offsetY = 5; // Slight vertical offset
            
            this.jetpack.x = this.player.x + offsetX;
            this.jetpack.y = this.player.y + offsetY;
            
            // Flip the jetpack sprite when it's on the right side of the player
            this.jetpack.flipX = !this.player.flipX; // Flip when opposite of player direction
            
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
        }
    }
    
    // Create flame effect for the jetpack
    createJetFlame() {
        // Determine flame position based on jetpack orientation
        // When player is facing left (flipX = true), jetpack is on right (offsetX = 20)
        // When player is facing right (flipX = false), jetpack is on left (offsetX = -20)
        const flameOffsetX = this.player.flipX ? 0 : 0; // Adjust based on jetpack sprite
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
    
    // Recharge jetpack fuel when on ground
    rechargeJetpack() {
        if (this.player.body.touching.down && this.jetpackFuel < 100) {
            this.jetpackFuel = Math.min(100, this.jetpackFuel + 0.5);
            this.fuelText.setText(`Fuel: ${Math.floor(this.jetpackFuel)}%`);
        }
    }

    update() {
        super.update();
        
        // if (!this.gameOver) {
        //     // Update jetpack position to follow player
        //     this.updateJetpackPosition();
            
        //     // Handle jetpack activation with space key
        //     if (this.spaceKey.isDown) {
        //         this.jetpackActive = this.activateJetpack();
        //     } else {
        //         this.jetpackActive = false;
        //     }
            
        //     // Recharge jetpack when on ground
        //     this.rechargeJetpack();
        // }
    }
}
