import React, { ChangeEvent } from "react";
import { Selector } from "./Selector";
import { Buttons } from "./Buttons";
import { Board } from "./Board";
import { shuffle } from "../../utils/shuffle";

interface PuzzleSolverState {
    tiles: number[];
    paused: boolean;
}

class PuzzleSolver extends React.Component<any, PuzzleSolverState> {
    constructor(props: any) {
        super(props);

        const initialDimension = 2;
        let tiles = [...Array(initialDimension ** 2).keys()];

        this.state = {
            tiles: shuffle(tiles),
            paused: true,
        };

        this.generateNewTiles = this.generateNewTiles.bind(this);
        this.randomizeTiles = this.randomizeTiles.bind(this);
        this.solve = this.solve.bind(this);
        this.pause = this.pause.bind(this);
        this.restart = this.restart.bind(this);
        this.swap = this.swap.bind(this);
    }

    generateNewTiles(e: ChangeEvent<HTMLSelectElement>): void {
        const newDimension = Number(e.target.value);
        let tiles = [...Array(newDimension ** 2).keys()];

        this.setState({
            tiles: shuffle(tiles),
        });
    }

    randomizeTiles() {
        this.setState({
            tiles: shuffle(this.state.tiles),
        });
    }

    solve() {
        this.setState({
            paused: false,
        });
    }

    pause() {
        this.setState({
            paused: true,
        });
    }

    restart() {
        this.setState({
            paused: false,
        });
    }

    findBlankIndex(): number {
        return this.state.tiles.indexOf(0);
    }

    isMovable(index: number): boolean {
        let movableIndices: number[] = [];
        const blankIndex = this.findBlankIndex();
        const dimension = Math.sqrt(this.state.tiles.length);

        if (blankIndex % dimension !== 0) {
            // blank is not at the left most side of n x n board
            movableIndices.push(blankIndex - 1);
        }

        if (blankIndex % dimension !== dimension - 1) {
            // blank is not at the right most side of board
            movableIndices.push(blankIndex + 1);
        }

        if (blankIndex >= dimension) {
            // blank is not at the top of board
            movableIndices.push(blankIndex - dimension);
        }

        if (blankIndex < this.state.tiles.length - dimension) {
            // blank is not at the top of board
            movableIndices.push(blankIndex + dimension);
        }

        return movableIndices.includes(index);
    }

    swap(index: number): void {
        const blankIndex = this.findBlankIndex();

        if (this.isMovable(index)) {
            let tilesClone = this.state.tiles.slice();
            [tilesClone[index], tilesClone[blankIndex]] = [
                tilesClone[blankIndex],
                tilesClone[index],
            ];
            this.setState({
                tiles: tilesClone,
            });
        }
    }

    render() {
        return (
            <div className="flex flex-col items-center justify-center">
                <Selector onOptionChange={this.generateNewTiles} />
                <Board tiles={this.state.tiles} swapFn={this.swap} />
                <Buttons
                    paused={this.state.paused}
                    randBtnOnClick={this.randomizeTiles}
                    solveBtnOnClick={this.solve}
                    pauseBtnOnClick={this.pause}
                    restartBtnOnClick={this.restart}
                />
            </div>
        );
    }
}

export default PuzzleSolver;
