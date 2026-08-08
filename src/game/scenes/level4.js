import { BaseLevel } from './base-level';
import { ScubaTank } from '../objects/scuba_tank';

export class Level4 extends BaseLevel {
    constructor() {
        super('Level4');
    }

    preload() {
    }

    create() {
        super.create();
        
        this.platforms.create(400, 568, 'ground').setScale(6, 2).refreshBody();

        this.platforms.create(700, 380, 'ground');
        this.platforms.create(1350, 360, 'ground').setScale(1.4, 1).refreshBody();


        // vertical
        this.platforms.create(300, 480, 'ground').setScale(0.1, 4).refreshBody();
        this.platforms.create(1120, 480, 'ground').setScale(0.1, 4).refreshBody();

        // make a water box using the water asset
        this.water = this.physics.add.sprite(710, 490, 'water').setScale(1.28, 0.25).refreshBody();
        this.water.body.setImmovable(true);
        this.water.body.allowGravity = false;
        this.water.setDepth(this.player.depth - 1);
        this.waterCollider = this.physics.add.collider(this.player, this.water, this.hitWater, null, this);


        this.scubaTank = new ScubaTank(this, () => {
            this.waterCollider.active = false;
        });
        const scubaTankSprite = this.scubaTank.create(1550, 320);
        this.physics.add.overlap(this.player, scubaTankSprite, (player) => {
            this.scubaTank.collect(player);
        });


        this.stars.create(1300, 500, 'star');
        this.stars.create(1400, 500, 'star');

    }




    update() {
        super.update();


    }
}
