import { BaseLevel } from "./base-level.js";
import { Dino } from '../objects/dino';

export class Level6 extends BaseLevel {
    constructor() {
        super('Level6');
    }

    preload() {

    }

    create() {
        super.create({
            spikes: [
                { x: 820, y: 570 },
                { x: 1020, y: 570 }
            ]
        });
        this.platforms.create(0, 600, 'ground').setScale(8, 1).refreshBody();

        // left side platform
        this.platforms.create(200, 300, 'ground').setScale(3, 1).refreshBody();
        this.rammableWall = this.physics.add.staticImage(400, 160, 'ground')
            .setScale(0.1, 8)
            .refreshBody();
        this.physics.add.collider(this.player, this.rammableWall);
        
        // middle platform
        this.platforms.create(900, 450, 'ground').setScale(1, 1).refreshBody();
        
        // right side platform
        this.platforms.create(1400, 400, 'ground').setScale(1, 1).refreshBody();
        
        
        this.dino = new Dino(this).create(1400, 100, 6);
        this.dino.addInteractions(this.rammableWall, this.spikes, this.stars);

    }

    update() {
        super.update();
    }
}