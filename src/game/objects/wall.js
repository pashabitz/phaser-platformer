export class Wall {
    constructor(scene) {
        this.scene = scene;
        this.sprite = null;
        this.collider = null;
        this.health = 30;
        this.ramDirection = null;
        this.damageAvailableAt = 0;
    }

    create(x, y, scaleX = 0.1, scaleY = 8) {
        this.sprite = this.scene.physics.add.staticImage(x, y, 'ground')
            .setScale(scaleX, scaleY)
            .refreshBody();

        return this;
    }

    addDino(dino) {
        this.collider = this.scene.physics.add.collider(dino.sprite, this.sprite, () => this.damage(dino));
    }

    update() {
        if (this.ramDirection === null) {
            return;
        }

        const movingAway = this.ramDirection === 1
            ? this.scene.player.cursors.left.isDown
            : this.scene.player.cursors.right.isDown;
        if (movingAway) {
            this.ramDirection = null;
        }
    }

    damage(dino) {
        if (!dino.attached || !this.sprite || this.ramDirection !== null || this.scene.time.now < this.damageAvailableAt) {
            return;
        }

        const ramDirection = dino.sprite.x < this.sprite.x ? 1 : -1;
        const isRamming = ramDirection === 1
            ? this.scene.player.cursors.right.isDown
            : this.scene.player.cursors.left.isDown;
        if (!isRamming) {
            return;
        }

        this.scene.sound.play('crack_wall');
        this.ramDirection = ramDirection;
        this.damageAvailableAt = this.scene.time.now + 200;
        this.health -= 10;
        this.showDamage();

        if (this.health <= 0) {
            this.collider.destroy();
            this.sprite.destroy();
            this.sprite = null;
        }
    }

    showDamage() {
        const damageLabel = this.scene.add.text(this.sprite.x + 24, this.sprite.y, '-10', {
            fontSize: '24px',
            fill: '#d22'
        }).setOrigin(0, 0.5);
        this.scene.tweens.add({
            targets: damageLabel,
            y: damageLabel.y - 48,
            alpha: 0,
            duration: 600,
            onComplete: () => damageLabel.destroy()
        });
    }
}