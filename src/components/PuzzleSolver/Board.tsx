import React from "react";
import { Square } from "./Square";

interface BoardProps {
    tiles: number[];
    swapFn(index: number): void;
}

export class Board extends React.Component<BoardProps, {}> {
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
            >
                {this.generateSquares()}
            </div>
        );
    }
}
