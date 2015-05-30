var Point = require('./Point');

class Box {
    constructor() {
        this.center = new Point(0, 0);
        this.origin = new Point(0, 0);
        this.width  = 0;
        this.height = 0;
    }

    setOrigin(origin) {
        this.origin = origin;

        this.center.setXY(
            this.origin.x + this.width  / 2,
            this.origin.y + this.height / 2
        );

        return this;
    }

    setCenter(center) {
        this.center = center;

        this.origin.setXY(
            this.center.x - this.width  / 2,
            this.center.y - this.height / 2
        );

        return this;
    }

    setDimensions(width, height) {
        this.width  = width;
        this.height = height;

        this.center.setXY(
            this.origin.x + this.width  / 2,
            this.origin.y + this.height / 2
        );

        return this;
    }

    anchor(direction) {
        switch (direction) {
            case 'top':
                return new Point(this.center.x, this.origin.y);
                break;

            case 'right':
                return new Point(this.origin.x + this.width, this.center.y);
                break;

            case 'bottom':
                return new Point(this.center.x, this.origin.y + this.height);
                break;

            case 'left':
                return new Point(this.origin.x, this.center.y);
                break;

            default:
                throw `Invalid direction ${ direction }`;
        }
    }

    setWidth(width) {
        this.width  = width;

        this.center.x = this.origin.x + this.width / 2;

        return this;
    }

    setHeight(height) {
        this.height = height;

        this.center.y = this.origin.y + this.height / 2;

        return this;
    }
}

module.exports = Box;