import { BaseLevel } from './base-level';

export class Level8 extends BaseLevel {
    constructor() {
        super('Level8');
    }

    preload() {

    }

    
    create() {
        super.create({
            playerSpawn: { x: 120, y: 1850 },
            platforms: [
                { x: 500, y: 1968, scaleX: 6, scaleY: 2 },
                { x: 200, y: 1810, scaleX: 0.5 },
                { x: 680, y: 1650, scaleX: 0.5 },
                { x: 280, y: 1490, scaleX: 0.5 },
                { x: 720, y: 1330, scaleX: 0.5 },
                { x: 160, y: 1010, scaleX: 0.5 },
                { x: 760, y: 850, scaleX: 0.5 },
                { x: 250, y: 690, scaleX: 0.5 },
                { x: 350, y: 370, scaleX: 1.2 },
                { x: 650, y: 210, scaleX: 0.5 },
            ],
            movingPlatforms: [
                { x: 400, y: 1170, speed: 100, offset: 200, xScale: 0.5 },
                { x: 600, y: 530, speed: 100, offset: 200, xScale: 0.5 },
            ],
            spikes: [
                { x: 400, y: 340 },
            ],
            bounds: {
                x: 0,
                y: 0,
                width: 1000,
                height: 2000
            }
        });

    }



    update() {
        super.update();
    }
}
