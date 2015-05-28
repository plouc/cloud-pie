var _ = require('lodash');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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