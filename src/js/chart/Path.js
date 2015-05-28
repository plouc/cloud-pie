var Point = require('./Point');

class Path {
    constructor(points) {
        this.points = points || [];
    }

    head(length) {
        length = length || 1;

        return this.points.slice(0, length);
    }

    tail(length) {
        length = length || 1;

        return this.points.slice(this.points.length - length);
    }
}

var opposites = {
    top:    'bottom',
    right:  'left',
    bottom: 'top',
    left:   'right'
};

Path.fromBoxes = function (boxA, boxB, offsetA, offsetB) {
    var dx = boxB.center.x - boxA.center.x;
    var dy = boxB.center.y - boxA.center.y;

    offsetA = offsetA || 0;
    offsetB = offsetB || 0;

    var direction;

    var oA = new Point(0, 0);
    var oB = new Point(0, 0);

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx >= 0) {
            direction = 'right';
            if (offsetA > 0) { oA.x = offsetA;  }
            if (offsetB > 0) { oB.x = -offsetB; }
        } else {
            direction = 'left';
            if (offsetA > 0) { oA.x = -offsetA; }
            if (offsetB > 0) { oB.x = offsetB;  }
        }
    } else {
        if (dy > 0) {
            direction = 'bottom';
            if (offsetA > 0) { oA.y = offsetA;  }
            if (offsetB > 0) { oB.y = -offsetB; }
        } else {
            direction = 'top';
            if (offsetA > 0) { oA.y = -offsetA; }
            if (offsetB > 0) { oB.y = offsetB;  }
        }
    }

    var points = [];
    var anchorA = boxA.anchor(direction);
    var anchorB = boxB.anchor(opposites[direction]);

    if (!oA.isDefault()) {
        oA.setXY(anchorA.x + oA.x, anchorA.y + oA.y);
        points.push(oA);
    }

    if (!oB.isDefault()) {
        oB.setXY(anchorB.x + oB.x, anchorB.y + oB.y);
        points.push(oB);
    }

    points.unshift(anchorA);
    points.push(anchorB);

    return new Path(points);
};

module.exports = Path;