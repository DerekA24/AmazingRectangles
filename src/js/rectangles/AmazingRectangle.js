import AbstractRectangle from './AbstractRectangle.js';

class AmazingRectangle extends AbstractRectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
        let sign = Math.random() < 0.5 ? -1 : 1;
        this.speedX = sign * (.5 + Math.random() * 2);
        this.speedY = sign * (.5 + Math.random() * 2);
        this.isPoisonous = false;
        this.health=1;
        this.maxHealth = null;
    }

    draw(context) {
        context.fillStyle = this.color || 'pink';
        context.fillRect(this.x, this.y, this.width, this.height);
        // Health Bar
        if (this.maxHealth !== null) {
            const barWidth = this.width*1.1;
            const barHeight = 5;
            const healthRatio = Math.max(0, this.health / this.maxHealth);

            // Position the bar just below the rectangle
            const barX = this.x - this.width*.05;
            const barY = this.y + this.height + 4;

            // Background
            context.fillStyle = 'gray';
            context.fillRect(barX, barY, barWidth, barHeight);

            // Health portion and ratio
            if (healthRatio > 0.5) context.fillStyle = 'limegreen';
            else if (healthRatio > 0.25) context.fillStyle = 'yellow';
            else context.fillStyle = 'red';
            context.fillRect(barX, barY, barWidth * healthRatio, barHeight);

            // boarder
            context.strokeStyle = 'black';
            context.lineWidth = 1;
            context.strokeRect(barX, barY, barWidth, barHeight);
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // If rectangle goes fully off canvas, teleport it to a random position
        const offLeft = this.x + this.width < 0;
        const offRight = this.x > canvas.width;
        const offTop = this.y + this.height < 0;
        const offBottom = this.y > canvas.height;

        if (offLeft || offRight || offTop || offBottom) {
            // teleport to random position inside canvas
            const maxX = Math.max(0, canvas.width - this.width);
            const maxY = Math.max(0, canvas.height - this.height);
            this.x = Math.random() * maxX;
            this.y = Math.random() * maxY;
            // re-randomize speed
            let sign = Math.random() < 0.5 ? -1 : 1;
            this.speedX = sign * (.5 + Math.random() * 2);
            this.speedY = sign * (.5 + Math.random() * 2);
        } else {
            // keep bouncing on edges when partially outside
            if (this.x < 0 || this.x + this.width > canvas.width) {
                this.speedX *= -1;
            }
            if (this.y < 0 || this.y + this.height > canvas.height) {
                this.speedY *= -1;
            }
        }
    }
    isInside(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
    getPoisonous() {
        return this.isPoisonous;
    }
    setPoisonous(value) {
        this.isPoisonous = value;
    }
    getHealth() {
        return this.health;
    }
    getMaxHealth() {
        return this.maxHealth;
    }
    setHealth(health) {
        this.health = health;
        this.maxHealth = health;
    }
    removeHealth(damage) {
        this.health = this.health-damage;
    }
}

export default AmazingRectangle;