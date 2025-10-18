// DrawingArea class manages the canvas and rectangle rendering.
class DrawingArea {
    constructor(canvas) {
        this.canvas = canvas || document.getElementById('drawingCanvas');
        if (!this.canvas) throw new Error('Canvas element not found');
        this.context = this.canvas.getContext('2d');
        this.rectangles = [];
        this.animationFrameId = null;
        this.lastTime = 0;
        // Ensure canvas internal size matches displayed size so width/height checks align
        this._fitCanvasToDisplay = this._fitCanvasToDisplay.bind(this);
        this._fitCanvasToDisplay();
        window.addEventListener('resize', this._fitCanvasToDisplay);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    _fitCanvasToDisplay() {
        // Use the displayed size (CSS pixels) so canvas.width/height match what user sees.
        const rect = this.canvas.getBoundingClientRect();
        const displayWidth = Math.max(1, Math.round(rect.width));
        const displayHeight = Math.max(1, Math.round(rect.height));
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            // reset context transform in case it was scaled
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    addRectangle(rectangle) {
        this.rectangles.push(rectangle);
    }
    removeRectangle(rectangle) {
        this.rectangles.re
    }
    draw(time) {
        const dt = this.lastTime ? (time - this.lastTime) / 1000 : 0;
        this.lastTime = time;
        this.clear();
        this.drawGrid(50);
        this.rectangles.forEach(rectangle => {
            if (typeof rectangle.update === 'function') rectangle.update(dt);
            if (typeof rectangle.draw === 'function') rectangle.draw(this.context);
        });
    }

    start() {
        if (!this.canvas) return;
        const loop = (t) => {
            this.draw(t);
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame(loop);
    }

    stop() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
    getRectangles() {
        return this.rectangles;
    }
    drawGrid(gridSize = 50) {
        const ctx = this.context;
        ctx.strokeStyle = '#333'; // dark gray
        ctx.lineWidth = .5;

        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
    }
}

export default DrawingArea;