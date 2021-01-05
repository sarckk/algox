import { Orientation } from "../../../utils/types";

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, true);
        ctx.fill();
    }

    static orientation(a: Point, b: Point, c: Point): Orientation {
        const area = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        return area < 0
            ? Orientation.CCW
            : area === 0
            ? Orientation.COLLINEAR
            : Orientation.CW;
    }

    static yCoordinateCmp(a: Point, b: Point) {
        return a.y - b.y;
    }

    polarAngleCmp(a: Point, b: Point) {
        const dy_a = a.y - this.y;
        const dy_b = b.y - this.y;

        if (dy_a === 0 && dy_b === 0) {
            // all three points are horizontal
            return 0;
        } else if (dy_a >= 0 && dy_b < 0) {
            return -1;
        } else if (dy_b >= 0 && dy_a < 0) {
            return 1;
        } else {
            return Point.orientation(this, a, b);
        }
    }
}
