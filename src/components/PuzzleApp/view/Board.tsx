import React from "react";
import { Square } from "./Square";
import { wrapGrid } from "animate-css-grid";

interface BoardProps {
    tiles: number[];
    swapFn(index: number): void;
}

export class Board extends React.Component<BoardProps, {}> {
    boardRef: React.RefObject<any>;

    constructor(props: BoardProps) {
        super(props);
        this.boardRef = React.createRef();
    }

    componentDidMount() {
        wrapGrid(this.boardRef.current, {
            easing: "easeOut",
            duration: 100,
        });
    }

    generateSquare(value: number, index: number): JSX.Element {
        return (
            <Square
                key={value}
                value={value}
                index={index}
                swapFn={this.props.swapFn}
            />
        );
    }

    generateSquares() {
        return this.props.tiles.map((value, index) =>
            this.generateSquare(value, index)
        );
    }

    render() {
        return (
            <div
                data-testid="board"
                className={`board grid grid-cols-${Math.sqrt(
                    this.props.tiles.length
                )} border`}
                ref={this.boardRef}
            >
                {this.generateSquares()}
            </div>
        );
    }
}
