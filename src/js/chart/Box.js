var Point = require('./Point');

class Box {
    constructor() {
        this.setOrigin(new Point(0, 0));
        this.center = new Point(0, 0);
        this.width  = 0;
        this.height = 0;
    }

    setOrigin(origin) {
        this.origin = origin;
        this.oX = this.origin.x;
        this.oY = this.origin.y;

        return this;
    }

    setDimensions(width, height) {
        this.width  = width;
        this.height = height;

        return this;
    }

    setWidth(width) {
        this.width  = width;

        return this;
    }

    setHeight(height) {
        this.height = height;

        return this;
    }
}

module.exports = Box;