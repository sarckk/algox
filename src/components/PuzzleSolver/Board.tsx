import React from "react";
import { Square } from "./Square";
import { shuffle } from "../../utils/shuffle";

interface BoardProps {
    tiles: number[];
}

export class Board extends React.Component<BoardProps, {}> {
    generateSquare(idx: number): JSX.Element {
        return <Square key={idx} value={this.props.tiles[idx]} />;
    }

    generateSquares() {
        const numRows = Math.sqrt(this.props.tiles.length);
        const numCols = numRows;

        return [...Array(numRows)].map((r, rowIndex) => (
            <div key={rowIndex}>
                {[...Array(numCols)].map((c, colIndex) =>
                    this.generateSquare(numCols * rowIndex + colIndex)
                )}
            </div>
        ));
    }

    render() {
        return <>{this.generateSquares()}</>;
    }
}
