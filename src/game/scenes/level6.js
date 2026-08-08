import { BaseLevel } from "./base-level.js";
export class Level6 extends BaseLevel {
    constructor() {
        super('Level6');
        this.wallHealth = 30;
        this.wallRamDirection = null;
        this.wallDamageAvailableAt = 0;
    }

    preload() {

    }

    create() {
        super.create({
            spikes: [
                { x: 820, y: 570 },
                { x: 1020, y: 570 }
            ]
        });
        this.platforms.create(0, 600, 'ground').setScale(8, 1).refreshBody();

        // left side platform
        this.platforms.create(200, 300, 'ground').setScale(3, 1).refreshBody();
        this.rammableWall = this.physics.add.staticImage(400, 160, 'ground')
            .setScale(0.1, 8)
            .refreshBody();
        this.physics.add.collider(this.player, this.rammableWall);
        
        // middle platform
        this.platforms.create(900, 450, 'ground').setScale(1, 1).refreshBody();
        
        // right side platform
        this.platforms.create(1400, 400, 'ground').setScale(1, 1).refreshBody();
        
        
        const dinoNpc = this.createDinoNpc(1400, 100, 6, 'left');
        this.physics.add.overlap(this.player, dinoNpc, this.attachPlayerToDino, null, this);
        this.wallCollider = this.physics.add.collider(dinoNpc, this.rammableWall, this.damageWall, null, this);

        this.physics.add.collider(dinoNpc, this.spikes, this.hitSpikesWithDino, null, this);

        this.physics.add.overlap(dinoNpc, this.stars, this.collectStarWithDino, null, this);

    }

    update() {
        super.update();
        this.rearmWallRam();
    }

    collectStarWithDino(dino, star) {
        if (dino === this.attachedDino) {
            this.collectStar(this.player, star);
        }
    }

    hitSpikesWithDino(dino, spikes) {
        if (dino === this.attachedDino) {
            this.hitSpikes(this.player, spikes);
        }
    }

    damageWall(dino, wall) {
        if (
            dino !== this.attachedDino ||
            !this.rammableWall ||
            this.wallRamDirection !== null ||
            this.time.now < this.wallDamageAvailableAt
        ) {
            return;
        }

        const ramDirection = dino.x < wall.x ? 1 : -1;
        const isRamming = ramDirection === 1
            ? this.cursors.right.isDown
            : this.cursors.left.isDown;

        if (!isRamming) {
            return;
        }

        this.sound.play('crack_wall');
        this.wallRamDirection = ramDirection;
        this.wallDamageAvailableAt = this.time.now + 200;
        this.wallHealth -= 10;
        this.showWallDamage(wall);

        if (this.wallHealth <= 0) {
            this.wallCollider.destroy();
            wall.destroy();
            this.rammableWall = null;
        }
    }

    rearmWallRam() {
        if (this.wallRamDirection === null || !this.attachedDino) {
            return;
        }

        const movingAway = this.wallRamDirection === 1
            ? this.cursors.left.isDown
            : this.cursors.right.isDown;

        if (movingAway) {
            this.wallRamDirection = null;
        }
    }

    showWallDamage(wall) {
        const damageLabel = this.add.text(wall.x + 24, wall.y, '-10', {
            fontSize: '24px',
            fill: '#d22'
        }).setOrigin(0, 0.5);

        this.tweens.add({
            targets: damageLabel,
            y: damageLabel.y - 48,
            alpha: 0,
            duration: 600,
            onComplete: () => damageLabel.destroy()
        });
    }
}