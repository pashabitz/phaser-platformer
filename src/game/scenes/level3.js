import { BaseLevel } from './base-level';

export class Level3 extends BaseLevel {
    constructor() {
        super('Level3');
    }

    preload() {
    }


    create() {
        super.create({
            platforms: [
                { x: 400, y: 568, scaleX: 6, scaleY: 2 },
                { x: 1450, y: 200 },
            ]
        });

        const movingPlatforms = [];
        movingPlatforms.push(this.makeMovingPlatform(150, 400, 50, 200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(450, 320, 50, -200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(750, 260, 50, 200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(1050, 180, 50, -200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(950, 100, 50, 200, 0.5));



        const spikes = this.physics.add.staticGroup();
        spikes.create(800, 520, 'spikes').setDepth(-1);
        spikes.create(1100, 520, 'spikes').setDepth(-1);


        for (const mp of movingPlatforms) {
            this.physics.add.collider(this.player, mp);
            this.physics.add.collider(this.stars, mp);
        }
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

        this.physics.add.overlap(spikes, this.stars, (spikes, star) => {
            star.disableBody(true, true);
        }, null, this);



    }




    update() {
        super.update();


    }
}
