import React from "react";
import { Point } from "./model/Point";
import { Orientation } from "../../utils/types";
import { Button } from "../../utils/shared/Button";

interface ConvexHullSolverState {
    points: Point[];
}

class ConvexHullSolver extends React.Component<any, ConvexHullSolverState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
        this.generatePoint = this.generatePoint.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);

        this.state = {
            points: [],
        };
    }

    generatePoint(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const rect = this.canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const point = new Point(x, y);

        const currentPoints = this.state.points.slice();
        currentPoints.push(point);

        const hullPoints = this.computeHull(currentPoints);
        this.connectLines(hullPoints);
        this.drawPoints(currentPoints);

        this.setState({
            points: currentPoints,
        });
    }

    clearCanvas() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.setState({
            points: [],
        });
    }

    computeHull(points: Point[]) {
        const pointsByYCoordinate = points.sort(Point.yCoordinateCmp);
        const pointsByPolarAngle = pointsByYCoordinate.sort(
            pointsByYCoordinate[0].polarAngleCmp.bind(pointsByYCoordinate[0])
        );

        if (pointsByPolarAngle.length < 3) {
            return pointsByPolarAngle;
        }

        const hullPoints: Point[] = [];
        hullPoints.push(points[0]);
        hullPoints.push(points[1]);

        for (let i = 2; i < points.length; i++) {
            let top = hullPoints.pop();
            while (
                Point.orientation(
                    hullPoints[hullPoints.length - 1],
                    top,
                    pointsByPolarAngle[i]
                ) !== Orientation.CCW
            ) {
                top = hullPoints.pop();
            }
            hullPoints.push(top);
            hullPoints.push(pointsByPolarAngle[i]);
        }

        return hullPoints;
    }

    drawPoints(points: Point[]) {
        const canvas = this.canvasRef.current;
        points.forEach((p) => p.draw(canvas));
    }

    connectLines(hullVertices: Point[]) {
        console.log(hullVertices);

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < hullVertices.length; i++) {
            const from = hullVertices[i];
            let to;
            if (i === hullVertices.length - 1) {
                // last element, connect back to first elem
                to = hullVertices[0];
            } else {
                to = hullVertices[i + 1];
            }

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
    }

    render() {
        return (
            <div>
                <div className="text-xl font-bold text-gray-700">
                    Convex hull solver
                </div>
                <p className="mb-4">
                    A convex hull is the smallest "fence" that contains all the
                    given points
                </p>
                <Button
                    clickFn={this.clearCanvas}
                    txt="Clear"
                    additionalClass="mb-6"
                />
                <canvas
                    onClick={this.generatePoint}
                    ref={this.canvasRef}
                    id="ch_canvas"
                    width="500"
                    height="500"
                    className="border border-gray-300"
                ></canvas>
            </div>
        );
    }
}

export default ConvexHullSolver;
