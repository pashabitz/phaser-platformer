export class Laser {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.gun = null;
        this.beam = null;
        this.pulse = null;
    }

    create(x, gunY, beamHeight = 520) {
        this.gun = this.scene.physics.add.sprite(x, gunY, 'laser_gun');
        this.gun.setScale(0.05);
        this.gun.body.setAllowGravity(false);

        this.beam = this.scene.add.rectangle(x, gunY + beamHeight / 2 + 20, 2, beamHeight, 0xff0000);
        this.scene.physics.add.existing(this.beam, true);
        this.beam.setVisible(false);
        this.beam.body.enable = false;

        this.scene.physics.add.collider(this.player, this.beam, (player) => {
            this.scene.dieAndTurnColor(player, 0xff0000);
        });

        this.pulse = this.scene.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => this.activateBeam()
        });

        return this;
    }

    activateBeam() {
        this.beam.setVisible(true);
        this.beam.body.enable = true;
        this.scene.time.delayedCall(500, () => {
            this.beam.setVisible(false);
            this.beam.body.enable = false;
        });
    }
}