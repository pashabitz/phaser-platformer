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
            ],
            movingPlatforms: [
                { x: 150, y: 400, speed: 50, offset: 200, xScale: 0.5 },
                { x: 450, y: 320, speed: 50, offset: -200, xScale: 0.5 },
                { x: 750, y: 260, speed: 50, offset: 200, xScale: 0.5 },
                { x: 1050, y: 180, speed: 50, offset: -200, xScale: 0.5 },
                { x: 950, y: 100, speed: 50, offset: 200, xScale: 0.5 }
            ]
        });

    }




    update() {
        super.update();


    }
}
