var _ = require('lodash');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     *
     * @returns {Point}
     */
    setXY(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @returns {Point}
     */
    offset(x, y) {
        this.x += x;
        this.y += y;

        return this;
    }

    /**
     * @returns {boolean}
     */
    isDefault() {
        return this.x === 0 && this.y === 0;
    }
}

/**
 * Compute center for given points.
 *
 * @param {Array} points
 * @returns {Point}
 */
Point.centerFromPoints = function (points) {
    return new Point(
        _.sum(_.pluck(points, 'x')) / points.length,
        _.sum(_.pluck(points, 'y')) / points.length
    );
};

module.exports = Point;