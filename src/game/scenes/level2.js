import { BaseLevel } from './base-level';
import { JetPack } from '../objects/jet_pack';

export class Level2 extends BaseLevel {
    constructor() {
        super('Level2');
    }

    preload() {
        // Jetpack asset is already loaded in the base scene preloader
    }


    create() {
        super.create({
            platforms: [
                { x: 400, y: 568, scaleX: 6, scaleY: 2 },
                { x: 150, y: 250 },
                { x: 700, y: 400 },
                { x: 1200, y: 250 },
                { x: 1700, y: 400 },
            ],
            spikes: [
                { x: 590, y: 366 },
                { x: 750, y: 366 }
            ]
        });

        this.jetPack = new JetPack(this);
        this.jetpack = this.jetPack.create(1550, 360);
        this.physics.add.overlap(this.player, this.jetpack, (player, jetpack) => {
            this.jetPack.attach(player, jetpack);
        });
    }


    update() {
        super.update();

        if (!this.gameOver) {
            this.jetPack.update(this.player);
        }
    }
}
