const cursorTracker = {
    cursorPosition: { x: 0, y: 0 },
    spinningRectangle: null,
    canvas: null,

    init: function(options = {}) {
        this.canvas = options.canvas || null;
        if (options.spinningRectangle) this.spinningRectangle = options.spinningRectangle;
        document.addEventListener('mousemove', this.updateCursorPosition.bind(this));
    },

    updateCursorPosition: function(event) {
        const target = this.canvas || event.target || document.body;
        const rect = target.getBoundingClientRect();
        this.cursorPosition.x = event.clientX - rect.left;
        this.cursorPosition.y = event.clientY - rect.top;
        this.updateSpinningRectanglePosition();
    },

    updateSpinningRectanglePosition() {
        if (this.spinningRectangle && typeof this.spinningRectangle.setPosition === 'function') {
            this.spinningRectangle.setPosition(this.cursorPosition.x, this.cursorPosition.y);
        }
    },

    getPosition() {
        return { x: this.cursorPosition.x, y: this.cursorPosition.y };
    },

    setSpinningRectangle(rect) {
        this.spinningRectangle = rect;
    }
};

export default cursorTracker;