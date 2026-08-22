import { BaseLevel } from './base-level';
import { Laser } from '../objects/laser';

export class Level7 extends BaseLevel {
    constructor() {
        super('Level7');
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
                { x: 350, y: 200, speed: 50, offset: 200, xScale: 0.5 },
                { x: 650, y: 120, speed: 50, offset: -200, xScale: 0.5 },

                { x: 950, y: 460, speed: 50, offset: 200, xScale: 0.5 },
                { x: 1250, y: 380, speed: 50, offset: -200, xScale: 0.5 },
                { x: 1150, y: 300, speed: 50, offset: 200, xScale: 0.5 }
            ]
        });

        this.lasers = [600, 900, 1200].map((x) => (
            new Laser(this, this.player).create(x, 25)
        ));
        

    }




    update() {
        super.update();


    }
}
