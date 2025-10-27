import AbstractRectangle from "./AbstractRectangle.js";
class PulsingRectangle extends AbstractRectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color || "purple";
        this.Radius = Math.random()*25+45;
        this.isPulsing = false;
        this.speedX = Math.random() * 4 - 1; // Random speed in x direction
        this.speedY = Math.random() * 4 - 1; // Random speed in y direction
        this.pulsePhase = 0;
        this.pulseAmplitude = 7; // how much the radius pulses
        this.pulseSpeed = 2;    // speed of pulsing
        this.currentRadius = this.Radius;
    }
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        if (this.isPulsing) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            context.beginPath();
            context.arc(centerX, centerY, this.currentRadius, 0, Math.PI * 2);
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.stroke();
        }
    }
    update(dt) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (Math.random()<0.005) {
            this.isPulsing = !this.isPulsing;
        }
        if (this.isPulsing) {
            this.color="red";
            this.pulsePhase += this.pulseSpeed * dt;
            this.currentRadius = this.Radius + Math.sin(this.pulsePhase) * this.pulseAmplitude;
        }
        
        else {
            this.currentRadius = this.Radius;
            this.color="purple";
        }
        // If rectangle goes fully off any side of the canvas, teleport it to a random position
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
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
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
    isPointIn(px, py) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const dx = px - centerX;
        const dy = py - centerY;
        return Math.sqrt(dx*dx + dy*dy) <= this.Radius;
    }
    Pulsing() {
        return this.isPulsing;
    }
}
export default PulsingRectangle;