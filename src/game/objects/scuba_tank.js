export class ScubaTank {
    constructor(scene, onCollect) {
        this.scene = scene;
        this.onCollect = onCollect;
        this.sprite = null;
        this.collected = false;
    }

    create(x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'scuba_tank');
        this.sprite.setScale(0.05);
        this.sprite.body.setAllowGravity(false);

        return this.sprite;
    }

    collect(player) {
        if (this.collected) {
            return;
        }

        this.collected = true;
        player.setTexture('dude_with_scuba')
            .setScale(0.05)
            .refreshBody();
        player.body.setSize(800, 800);
        player.body.setOffset(100, 100);
        player.anims.stop();
        this.scene.isScuba = true;
        this.onCollect();
        this.sprite.disableBody(true, true);
    }
}