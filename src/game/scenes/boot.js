import { Scene } from "phaser";

export class BootScene extends Scene {
    constructor() {
        super("Boot");
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
        this.load.image('water', 'assets/water.jpg');
        this.load.image('scuba_tank', 'assets/scuba_tank.png');
        this.load.image('dude_with_scuba', 'assets/dude_with_scuba.png');
        this.registry.score = 0;
    }

    create() {
        this.scene.start("Level1");
    }
    update() {
        // Update logic for the boot scene if needed
    }
}
