var _ = require('lodash');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

Point.centerFromPoints = function (points) {
    var xs = _.pluck(points, 'x');
    var ys = _.pluck(points, 'y');

    return new Point(
        _.sum(xs) / points.length,
        _.sum(ys) / points.length
    );
};

module.exports = Point;