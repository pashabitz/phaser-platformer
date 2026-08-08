import { BaseLevel } from "./base-level.js";
import { Laser } from '../objects/laser';

export class Level5 extends BaseLevel {
    constructor() {
        super('Level5');
    }

    preload() {

    }

    create() {
        super.create({
            platforms: [
                { x: 0, y: 600, scaleX: 8 },
                { x: 1120, y: 400 }
            ],
            spikes: [
                { x: 1020, y: 570 },
                { x: 1220, y: 570 }
            ]
        });

        this.lasers = [600, 900, 1400].map((x) => (
            new Laser(this, this.player).create(x, 25)
        ));

    }

    update() {
        super.update();
    }
}