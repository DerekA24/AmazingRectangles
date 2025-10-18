import AbstractRectangle from './AbstractRectangle.js';

class SwingingRectangle extends AbstractRectangle {
    constructor(x, y, width, height, swingAngle) {
        super(x, y, width, height);
        this.angle = 0;
        this.speed = 0.05; // Speed of swinging
        this.swingAngle = swingAngle || 0;
        this.color = this.color || 'orange';
        this.health = 1;
        this.maxHealth = 1;
        this.isShield=false;
        this.shieldTime=8;
        this.currentTime=0;
    }

    // Accept either (cursorX, cursorY) or (dt)
    update(a, b, canvas, dt=0) {
        if (typeof a === 'number' && typeof b === 'number') {
            const cursorX = a;
            const cursorY = b;
            // Update the angle based on cursor position
            const deltaX = cursorX - this.x;
            const deltaY = cursorY - this.y;
            this.angle = Math.atan2(deltaY, deltaX);

            // Update position to follow the cursor with a swinging effect
            this.x += Math.cos(this.angle) * this.speed * 10;
            this.y += Math.sin(this.angle) * this.speed * 10;
        } else {
            // Called with dt or no args: simple idle swinging motion
            const dt = typeof a === 'number' ? a : 0;
            this.angle += this.speed * dt * 60; // scale dt to sensible value
            // small oscillation around current position
            this.x += Math.cos(this.angle) * this.speed * 2;
            this.y += Math.sin(this.angle) * this.speed * 2;
        }
        if (canvas) {
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
        }
        if (this.isShield) {
            this.currentTime += dt; // accumulate time while shield is active
            if (this.currentTime < this.shieldTime) {
                if (this.currentTime>this.shieldTime-1) {
                    this.color="yellow";
                }
                else {
                    this.color="blue";
                }
            }
            else {
                // Shield expired
                this.isShield = false; // turn off shield
                this.color = "orange";
                this.currentTime = 0; // reset for next activation
            }
        }
        
    }

    draw(context) {
        context.save();
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.rotate((Math.PI / 180) * this.swingAngle);
        context.fillStyle = this.color;
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
        // Draw health bar if health/maxHealth are set
        if (this.maxHealth !== null && this.maxHealth > 0) {
            const barMargin = 10; // space above bottom edge
            // Use a percentage of the canvas width but ensure we never exceed canvas width minus margins
            const maxBarWidth = Math.max(100, Math.min(canvas.width - 40, canvas.width * 0.6));
            const barWidth = maxBarWidth;
            const barHeight = 10;

            // healthRatio should be clamped between 0 and 1
            const healthRatio = Math.max(0, Math.min(1, this.health / this.maxHealth));
            const barX = (canvas.width - barWidth) / 2; // center horizontally
            const barY = canvas.height - barHeight - barMargin; // near bottom

            // Background bar
            context.fillStyle = 'gray';
            context.fillRect(barX, barY, barWidth, barHeight);

            // Health fill
            if (healthRatio > 0.5) context.fillStyle = 'limegreen';
            else if (healthRatio > 0.25) context.fillStyle = 'yellow';
            else context.fillStyle = 'red';
            context.fillRect(barX, barY, barWidth * healthRatio, barHeight);

            // border
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.strokeRect(barX, barY, barWidth, barHeight);
        }
        
    }
    returnLocation() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }
    getHealth() {
        return this.health;
    }
    setHealth(health) {
        // When setting health on the swinging rectangle, treat the value as the new max health
        // if it's greater than the current max, and ensure current health is clamped to max.
        const parsed = Number(health) || 0;
        // If maxHealth is not set or new value is larger, update maxHealth
        if (this.maxHealth == null || parsed > this.maxHealth) {
            this.maxHealth = parsed;
        }
        // Set current health but clamp to [0, maxHealth]
        this.health = Math.max(0, Math.min(parsed, this.maxHealth));

    }
    removeHealth(value) {
        this.health-=value;
    }
    setShield(value) {
        this.isShield=value;
    }
    getShield() {
        return this.isShield;
    }
}

export default SwingingRectangle;