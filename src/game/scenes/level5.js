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
            spikes: [
                { x: 1020, y: 570 },
                { x: 1220, y: 570 }
            ]
        });


        this.platforms.create(0, 600, 'ground').setScale(8, 1).refreshBody();
        this.platforms.create(1120, 400, 'ground').setScale(1, 1).refreshBody();

        this.lasers = [600, 900, 1400].map((x) => (
            new Laser(this, this.player).create(x, 25)
        ));

    }

    update() {
        super.update();
    }
}