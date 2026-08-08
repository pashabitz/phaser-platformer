import { BaseLevel } from './base-level';

export class Level1 extends BaseLevel {
    constructor() {
        super('Level1');
    }

    preload() {

    }

    
    create() {
        super.create({
            platforms: [
                { x: 400, y: 568, scaleX: 6, scaleY: 2 },
                { x: 600, y: 400 },
                { x: 50, y: 250 },
                { x: 1200, y: 320 },
            ]
        });

        const movingPlatform = this.makeMovingPlatform(750, 180, 50, 200);

        

        const spikes = this.physics.add.staticGroup();
        spikes.create(600, 366, 'spikes').setDepth(-1);



        this.physics.add.collider(this.player, movingPlatform);
        this.physics.add.overlap(spikes, this.stars, (spikes, star) => {
            star.disableBody(true, true);
        }, null, this);
        this.physics.add.collider(this.stars, movingPlatform);
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

    }



    update() {
        super.update();
    }
}
