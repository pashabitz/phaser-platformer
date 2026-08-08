import { BaseLevel } from './base-level';
import { ScubaTank } from '../objects/scuba_tank';

export class Level4 extends BaseLevel {
    constructor() {
        super('Level4');
    }

    preload() {
    }

    createWater() {
        this.water = this.physics.add.sprite(710, 490, 'water').setScale(1.28, 0.25).refreshBody();
        this.water.body.setImmovable(true);
        this.water.body.allowGravity = false;
        this.water.setDepth(this.player.depth - 1);
        this.waterCollider = this.physics.add.collider(this.player, this.water, this.hitWater, null, this);
    }

    create() {
        super.create({
            platforms: [
                { x: 400, y: 568, scaleX: 6, scaleY: 2 },
                { x: 700, y: 380 },
                { x: 1350, y: 360, scaleX: 1.4 },
                { x: 300, y: 480, scaleX: 0.1, scaleY: 4 },
                { x: 1120, y: 480, scaleX: 0.1, scaleY: 4 }
            ]
        });

        this.createWater();

        this.scubaTank = new ScubaTank(this, () => {
            this.waterCollider.active = false;
        });
        const scubaTankSprite = this.scubaTank.create(1550, 320);
        this.physics.add.overlap(this.player, scubaTankSprite, (player) => {
            this.scubaTank.collect(player);
        });


        this.stars.add(1300, 500);
        this.stars.add(1400, 500);

    }




    update() {
        super.update();


    }
}
