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
            ],
            spikes: [
                { x: 600, y: 366 }
            ],
            movingPlatforms: [
                { x: 750, y: 180, speed: 50, offset: 200 }
            ]
        });

    }



    update() {
        super.update();
    }
}
