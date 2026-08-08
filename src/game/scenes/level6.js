import { BaseLevel } from "./base-level.js";
import { Dino } from '../objects/dino';
import { Wall } from '../objects/wall';

export class Level6 extends BaseLevel {
    constructor() {
        super('Level6');
    }

    preload() {

    }

    create() {
        super.create({
            platforms: [
                { x: 0, y: 600, scaleX: 8 },
                { x: 200, y: 300, scaleX: 3 },
                { x: 900, y: 450 },
                { x: 1400, y: 400 }
            ],
            spikes: [
                { x: 820, y: 570 },
                { x: 1020, y: 570 }
            ]
        });

        this.wall = new Wall(this).create(400, 160);
        this.physics.add.collider(this.player, this.wall.sprite);

        this.dino = new Dino(this).create(1400, 100, 6);
        this.dino.addInteractions(this.wall, this.spikes, this.stars);

    }

    update() {
        super.update();
        this.wall.update();
    }
}