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
        player.equipScuba();
        this.onCollect();
        this.sprite.disableBody(true, true);
    }
}