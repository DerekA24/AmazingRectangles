class AbstractRectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(context) {
        context.fillStyle = this.color || 'black';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    update() {
        // To be overridden by subclasses 
    }
}

export default AbstractRectangle;