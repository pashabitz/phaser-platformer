import { BaseLevel } from './base-level';

export class Level4 extends BaseLevel {
    constructor() {
        super('Level4');
    }

    preload() {
    }

    createScubaTank(player) {
        // Create the scuba tank sprite using proper scuba tank asset
        this.scubaTank = this.physics.add.sprite(1550, 320, 'scuba_tank');
        this.scubaTank.setScale(0.05); // Adjust scale as needed for this asset

        this.scubaTank.body.setAllowGravity(false);
        this.physics.add.overlap(player, this.scubaTank, this.attachScubaTank, null, this);
    }
    attachScubaTank(player, scubaTank) {
        // change the player avatar to be the asset dude_with_scuba
        player.setTexture('dude_with_scuba')
            .setScale(0.05)
            .refreshBody();
        player.body.setSize(800, 800);
        player.body.setOffset(100, 100);
        player.anims.stop(); // Adjust scale as needed for this asset
        this.isScuba = true;
        this.waterCollider.active = false;

        // remove the scuba tank from the scene
        scubaTank.disableBody(true, true);
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


        this.createScubaTank(this.player);


        this.generateStars(15, 90);
        this.stars.create(1300, 500, 'star');
        this.stars.create(1400, 500, 'star');


        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    }




    update() {
        super.update();


    }
}
