import AbstractRectangle from './AbstractRectangle.js';

class TurretRectangle extends AbstractRectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color || 'blue';
        this.isFiring = false;
        this.fireCooldown = 0;
        this.fireRate = 0.2; // seconds between bullets

    }
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update(dt) {
        // random bullet firing
        if (Math.random() < 0.005) this.isFiring = !this.isFiring;

        // decrease cooldown
        if (this.fireCooldown > 0) this.fireCooldown -= dt;

        // color based on firing
        this.color = this.isFiring ? "red" : "blue";
    }
    returnLocation() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }
    canFire() {
        return this.isFiring && this.fireCooldown <= 0;
    }
    resetCooldown() {
        this.fireCooldown = this.fireRate;
    }
}
export default TurretRectangle;