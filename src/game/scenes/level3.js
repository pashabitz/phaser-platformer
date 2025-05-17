import { BaseLevel } from './base-level';

export class Level3 extends BaseLevel {
    constructor() {
        super('Level3');
    }

    preload() {
    }


    create() {
        super.create();
        this.platforms.create(400, 568, 'ground').setScale(6, 2).refreshBody();

        this.platforms.create(1450, 200, 'ground');


        const movingPlatforms = [];
        movingPlatforms.push(this.makeMovingPlatform(150, 400, 50, 200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(450, 320, 50, -200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(750, 260, 50, 200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(1050, 180, 50, -200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(950, 100, 50, 200, 0.5));



        const spikes = this.physics.add.staticGroup();
        spikes.create(800, 520, 'spikes').setDepth(-1);
        spikes.create(1100, 520, 'spikes').setDepth(-1);


        this.generateStars(15, 90);



        this.physics.add.collider(this.stars, this.platforms);
        for (const mp of movingPlatforms) {
            this.physics.add.collider(this.player, mp);
            this.physics.add.collider(this.stars, mp);
        }
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(spikes, this.stars, (spikes, star) => {
            star.disableBody(true, true);
        }, null, this);



    }




    update() {
        super.update();


    }
}
