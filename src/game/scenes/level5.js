import { BaseLevel } from "./base-level.js";
export class Level5 extends BaseLevel {
    constructor() {
        super('Level5');
    }

    preload() {

    }

    createLaser(x, gunY, beamHeight = 520) {
        const laserGun = this.physics.add.sprite(x, gunY, 'laser_gun');
        laserGun.setScale(0.05);
        laserGun.body.setAllowGravity(false);

        const laserBeam = this.add.rectangle(x, gunY + beamHeight / 2 + 20, 2, beamHeight, 0xff0000);
        this.physics.add.existing(laserBeam, true);
        laserBeam.setVisible(false);
        laserBeam.body.enable = false;

        this.physics.add.collider(this.player, laserBeam, (player) => {
            this.dieAndTurnColor(player, 0xff0000);
        });

        const pulse = this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
                laserBeam.setVisible(true);
                laserBeam.body.enable = true;
                this.time.delayedCall(500, () => {
                    laserBeam.setVisible(false);
                    laserBeam.body.enable = false;
                });
            }
        });

        return { laserGun, laserBeam, pulse };
    }
    create() {
        super.create();


        this.platforms.create(0, 600, 'ground').setScale(8, 1).refreshBody();
        this.platforms.create(1120, 400, 'ground').setScale(1, 1).refreshBody();

        const spikes = this.physics.add.staticGroup();
        spikes.create(1020, 570, 'spikes').setDepth(-1);
        spikes.create(1220, 570, 'spikes').setDepth(-1);
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

        this.createLaser(600, 25);
        this.createLaser(900, 25);
        this.createLaser(1400, 25);

        this.generateStars(15, 90);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    }

    update() {
        super.update();
    }
}