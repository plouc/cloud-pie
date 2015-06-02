/* @flow */
import Point from './Point';
import Box   from './Box';

var opposites = {
    top:    'bottom',
    right:  'left',
    bottom: 'top',
    left:   'right'
};

class Path {
    points: Array<any>;

    constructor(points: Array<any> = []) {
        this.points = points;
    }

    head(length: number = 1): Array<any> {
        return this.points.slice(0, length);
    }

    tail(length: number = 1): Array<any> {
        return this.points.slice(this.points.length - length);
    }

    static fromBoxes(boxA: Box, boxB: Box, offsetA: number = 0, offsetB: number = 0) {
        var dx = boxB.center.x - boxA.center.x;
        var dy = boxB.center.y - boxA.center.y;

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
            if (dy >= 0) {
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
    }
}

export default Path;
