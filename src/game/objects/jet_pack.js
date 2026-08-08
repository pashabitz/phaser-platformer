export class JetPack {
    constructor(scene) {
        this.scene = scene;
        this.sprite = null;
        this.attached = false;
        this.attachedAt = 0;
        this.fuelRemaining = 0;
        this.fuelText = null;
    }

    create(x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'jetpack');
        this.sprite.setScale(0.05);
        this.sprite.body.setAllowGravity(false);

        return this.sprite;
    }

    attach(player, sprite) {
        if (this.attached) {
            return;
        }

        this.attached = true;
        this.attachedAt = Date.now();
        this.fuelRemaining = 100;
        player.isFlying = true;
        this.fuelText = this.scene.add.text(16, 50, 'Fuel: 100', { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);

        sprite.setDepth(player.depth - 1);
        sprite.body.enable = false;
        this.updatePosition(player);
        this.scene.tweens.add({
            targets: sprite,
            scale: { from: 0.05, to: 0.06 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    update(player) {
        if (!this.attached) {
            return;
        }

        this.updatePosition(player);
        this.fuelRemaining = Math.max(0, 100 - Math.floor((Date.now() - this.attachedAt) / 100) * 2);
        this.fuelText.setText(`Fuel: ${this.fuelRemaining}`);

        if (this.fuelRemaining === 0) {
            this.deactivate();
        }
    }

    updatePosition(player) {
        if (!this.sprite) {
            return;
        }

        const facesLeft = player.movementDirection === 'left';
        this.sprite.setPosition(player.x + (facesLeft ? 20 : -20), player.y + 5);
        this.sprite.setFlipX(facesLeft);
        this.sprite.setAlpha(player.isFlying ? 1 : 0.8);
    }

    deactivate() {
        this.scene.player.isFlying = false;
        this.scene.tweens.killTweensOf(this.sprite);
    }
}