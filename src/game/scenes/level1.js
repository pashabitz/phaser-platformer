import { BaseLevel } from './base-level';

export class Level1 extends BaseLevel {
    constructor() {
        super('Level1');
    }

    preload() {

        this.load.image('background', 'assets/bg.png');

        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('spikes', 'assets/spikes.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('jetpack', 'assets/jetpack.png');
        this.registry.score = 0;
    }

    
    create() {
        super.create();

        this.platforms.create(400, 568, 'ground').setScale(6, 2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(1200, 320, 'ground');

        const movingPlatform = this.makeMovingPlatform(750, 180, 50, 200);

        

        const spikes = this.physics.add.staticGroup();
        spikes.create(600, 366, 'spikes').setDepth(-1);

        this.generateStars(15, 90);


        this.physics.add.collider(this.player, movingPlatform);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(spikes, this.stars, (spikes, star) => {
            star.disableBody(true, true);
        }, null, this);
        this.physics.add.collider(this.stars, movingPlatform);
        this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this);

    }



    update() {
        super.update();
    }
}
