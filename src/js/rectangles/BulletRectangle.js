import AbstractRectangle from "./AbstractRectangle.js";

class BulletRectangle extends AbstractRectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color || "black";
        this.speedX = 0;
        this.speedY = 0;
    }
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    setSpeed(speedX, speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

    }
    isOffCanvas() {
        return (this.x + this.width < 0 || this.x > canvas.width || this.y + this.height < 0 || this.y > canvas.height);
    }
}
export default BulletRectangle;