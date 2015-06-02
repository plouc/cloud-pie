/* @flow */
import _ from 'lodash';

export default Point;

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {Point}
     */
    clone(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * @param {Number} x
     * @param {Number} y
     *
     * @returns {Point}
     */
    setXY(x: number, y: number): Point {
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
    offset(x: number, y: number): Point {
        this.x += x;
        this.y += y;

        return this;
    }

    /**
     * @returns {boolean}
     */
    isDefault(): boolean {
        return this.x === 0 && this.y === 0;
    }

    /**
     * Compute center for given points.
     *
     * @param {Array<Point>} points
     * @returns {Point}
     */
    static centerFromPoints(points: Array<Point>): Point {
        return new Point(
            _.sum(_.pluck(points, 'x')) / points.length,
            _.sum(_.pluck(points, 'y')) / points.length
        );
    }
}

export default Point;
