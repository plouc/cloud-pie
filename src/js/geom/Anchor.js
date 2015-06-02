import Point from './Point';

class Anchor {

    origin:  Point;
    spacing: number;
    count:   number;
    points:  Array;

    constructor(origin: { x: number; y: number; }, options: Object = {}) {
        options = options || {};

        this.origin     = origin;
        this.spacing    = options.spacing || 50;
        this.count      = 0;
        this.points     = [];
        this.index      = 0;
        this.distribute = options.distribute || 'horizontal';

        this.points = [this.origin];
    }

    setOrigin(origin: { x: number; y: number; }) {
        this.origin = origin;
    }

    add() {
        this.count++;

        this.points = [];

        var x, y, stepX, stepY;
        x = y = stepX = stepY = 0;
        if (this.distribute === 'horizontal') {
            x     = this.spacing * (this.count - 1) * -0.5;
            stepX = this.spacing;
        } else if (this.distribute === 'vertical') {
            y     = this.spacing * (this.count - 1) * -0.5;
            stepY = this.spacing;
        }

        for (var i = 0; i < this.count; i++) {
            this.points.push({
                x: this.origin.x + x,
                y: this.origin.y + y
            });

            x += stepX;
            y += stepY;
        }
    }

    get(): { x: number; y: number; } {
        return this.points[this.index];
    }

    next() {
        if (this.index < this.points.length) {
            this.index++;
        }
    }

    reset() {
        this.index = 0;
    }
}

export default Anchor;
