/* @flow */
import Point  from './Point';
import Anchor from './Anchor';

class Box {
    center: Point;
    origin: Point;

    width:  number;
    height: number;

    anchors: {
        top:    Anchor;
        right:  Anchor;
        bottom: Anchor;
        left:   Anchor;
    };

    constructor() {
        this.center = new Point(0, 0);
        this.origin = new Point(0, 0);

        this.width  = 0;
        this.height = 0;

        this.anchors = {
            top:    new Anchor(),
            right:  new Anchor(),
            bottom: new Anchor(),
            left:   new Anchor()
        };
    }

    setOrigin(origin: Point): Box {
        this.origin = origin;

        this.center.setXY(
            this.origin.x + this.width  / 2,
            this.origin.y + this.height / 2
        );

        return this;
    }

    setCenter(center: Point): Box {
        this.center = center;

        this.origin.setXY(
            this.center.x - this.width  / 2,
            this.center.y - this.height / 2
        );

        return this;
    }

    setDimensions(width: number, height: number): Box {
        this.width  = width;
        this.height = height;

        this.center.setXY(
            this.origin.x + this.width  / 2,
            this.origin.y + this.height / 2
        );

        return this;
    }

    anchor(direction: string): Point {
        switch (direction) {
            case 'top':
                return new Point(this.center.x, this.origin.y);

            case 'right':
                return new Point(this.origin.x + this.width, this.center.y);

            case 'bottom':
                return new Point(this.center.x, this.origin.y + this.height);

            case 'left':
                return new Point(this.origin.x, this.center.y);

            default:
                throw `Invalid direction ${ direction }`;
        }
    }

    setWidth(width: number): Box {
        this.width  = width;

        this.center.x = this.origin.x + this.width / 2;

        return this;
    }

    setHeight(height: number): Box {
        this.height = height;

        this.center.y = this.origin.y + this.height / 2;

        return this;
    }
}

export default Box;
