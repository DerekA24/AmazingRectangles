import AbstractRectangle from "./AbstractRectangle.js";

class Grenade extends AbstractRectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color || "green";
        this.speedX = 0;
        this.speedY = 0;

        this.explodeDelay = 2;       // seconds before explosion
        this.explodeDuration = 2;  // seconds explosion lasts
        this.explodeRadius = 255;

        this.state = "flying"; // "flying" → "exploding" → "gone"
        this.timer = 0;
        this.currentRadius = 0;
    }

    draw(context) {
        if (this.state === "flying") {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        } 
        else if (this.state === "exploding") {
            
            // Glowing orange explosion effect
            context.fillStyle = 'rgba(255, 165, 0, 0.3)'; // transparent orange fill
            context.beginPath();
            context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
            context.fill();

            // Optional bright outline
            context.strokeStyle = 'orange';
            context.lineWidth = 3;
            context.stroke();
                }
                // if "gone", draw nothing
    }

    update(dt) {
        this.timer += dt;

        if (this.state === "flying") {
            // Move
            this.x += this.speedX;
            this.y += this.speedY;

            // After delay, start explosion
            if (this.timer+.7>=this.explodeDelay&&this.timer<this.explodeDelay) {
                this.color="red";
            }
            else if (this.timer >= this.explodeDelay) {
                this.state = "exploding";
                this.timer = 0;
                this.speedX = 0;
                this.speedY = 0;
                this.currentRadius = 0;
            }
        } 
        else if (this.state === "exploding") {
            // Expand explosion
            if (this.currentRadius < this.explodeRadius) {
                this.currentRadius += 10;
            }

            // After explosion duration, disappear
            if (this.timer >= this.explodeDuration) {
                this.state = "gone";
            }
        }
    }

    setSpeed(vx, vy) {
        this.speedX = vx;
        this.speedY = vy;
    }

    isWithin(px, py) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        return Math.sqrt(dx * dx + dy * dy) <= this.currentRadius;
    }

    Disappear() {
        // The game loop should remove it only when it's "gone"
        return this.state === "gone";
    }

    getExplode() {
        return this.state === "exploding";
    }
}

export default Grenade;
