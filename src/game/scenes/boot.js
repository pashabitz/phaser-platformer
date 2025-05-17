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
        this.registry.score = 0;
    }

    create() {
        this.scene.start("Level2");
    }
    update() {
        // Update logic for the boot scene if needed
    }
}
