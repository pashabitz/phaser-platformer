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
            ],
            spikes: [
                { x: 800, y: 520 },
                { x: 1100, y: 520 }
            ]
        });

        const movingPlatforms = [];
        movingPlatforms.push(this.makeMovingPlatform(150, 400, 50, 200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(450, 320, 50, -200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(750, 260, 50, 200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(1050, 180, 50, -200, 0.5));
        movingPlatforms.push(this.makeMovingPlatform(950, 100, 50, 200, 0.5));

        for (const mp of movingPlatforms) {
            this.physics.add.collider(this.player, mp);
            this.physics.add.collider(this.stars, mp);
        }

    }




    update() {
        super.update();


    }
}
