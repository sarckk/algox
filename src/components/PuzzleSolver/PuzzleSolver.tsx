import React, { ChangeEvent } from "react";
import { Selector } from "./Selector";
import { Buttons } from "./Buttons";
import { Board } from "./Board";
import { Alert } from "./Alert";
import { Info } from "./Info";
import { shuffle } from "../../utils/shuffle";
import Confetti from "react-dom-confetti";

interface PuzzleSolverState {
    tiles: number[];
    paused: boolean;
    isSolvable: boolean;
    solved: boolean;
}

class PuzzleSolver extends React.Component<any, PuzzleSolverState> {
    constructor(props: any) {
        super(props);

        const initialDimension = 2;
        let tiles = [...Array(initialDimension ** 2).keys()];
        let shuffledTiles = shuffle(tiles);
        const isSolvable = this.isSolvable(shuffledTiles);
        const solved = this.isSolved(shuffledTiles);

        this.state = {
            tiles,
            paused: true,
            isSolvable,
            solved,
        };

        this.generateNewTiles = this.generateNewTiles.bind(this);
        this.solve = this.solve.bind(this);
        this.pause = this.pause.bind(this);
        this.restart = this.restart.bind(this);
        this.swap = this.swap.bind(this);
    }

    generateNewTiles(e?: ChangeEvent<HTMLSelectElement>): void {
        let shuffledTile: number[];

        if (e.target.value) {
            const newDimension = Number(e.target.value);
            let tiles = [...Array(newDimension ** 2).keys()];
            shuffledTile = shuffle(tiles);
        } else {
            shuffledTile = shuffle(this.state.tiles);
        }

        const isSolvable = this.isSolvable(shuffledTile);
        const solved = this.isSolved(shuffledTile);

        this.setState({
            tiles: shuffledTile,
            isSolvable,
            solved,
        });
    }

    isSolved(tiles: number[]): boolean {
        const solvedTile = [...Array(tiles.length).keys()].map(
            (tile, index) => {
                if (index === tiles.length - 1) {
                    return 0;
                }
                return tile + 1;
            }
        );

        return solvedTile.every((elem, index) => elem === tiles[index]);
    }

    solve() {
        this.setState({
            paused: false,
            solved: true,
        });
    }

    pause() {
        this.setState({
            paused: true,
            solved: false,
        });
    }

    restart() {
        this.setState({
            paused: false,
            solved: false,
        });
    }

    findBlankIndex(tiles: number[]): number {
        return tiles.indexOf(0);
    }

    isMovable(index: number): boolean {
        let movableIndices: number[] = [];
        const blankIndex = this.findBlankIndex(this.state.tiles);
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
        const blankIndex = this.findBlankIndex(this.state.tiles);

        if (this.isMovable(index)) {
            let tilesClone = this.state.tiles.slice();
            [tilesClone[index], tilesClone[blankIndex]] = [
                tilesClone[blankIndex],
                tilesClone[index],
            ];

            const solved = this.isSolved(tilesClone);
            console.log(solved);

            this.setState({
                tiles: tilesClone,
                solved,
            });
        }
    }

    isSolvable(tiles: number[]): boolean {
        const inversions = tiles.reduce((acc, cur, index, arr) => {
            if (index === arr.length - 1) {
                return acc;
            }

            let subarray = arr.slice(index + 1);
            let count = 0;

            for (const x of subarray) {
                if (x < cur && x !== 0) {
                    count++;
                }
            }

            return acc + count;
        }, 0);

        const dimension = Math.sqrt(tiles.length);
        if (dimension % 2 === 0) {
            const blankIndex = this.findBlankIndex(tiles);
            const blankRowNum = Math.floor(blankIndex / dimension);
            const blankOnOddRowFromBtm = (dimension - blankRowNum) % 2 !== 0;
            return (inversions % 2 === 0) === blankOnOddRowFromBtm;
        } else {
            return inversions % 2 === 0;
        }
    }

    render() {
        return (
            <div className="flex flex-col items-center justify-center">
                <Selector onOptionChange={this.generateNewTiles} />
                <Board tiles={this.state.tiles} swapFn={this.swap} />
                <Confetti
                    active={this.state.solved}
                    config={{ dragFriction: 0.15 }}
                />
                <Buttons
                    isSolvable={this.state.isSolvable}
                    paused={this.state.paused}
                    randBtnOnClick={this.generateNewTiles}
                    solveBtnOnClick={this.solve}
                    pauseBtnOnClick={this.pause}
                    restartBtnOnClick={this.restart}
                />
                {this.state.solved && <Info />}
                {!this.state.isSolvable && <Alert />}
            </div>
        );
    }
}

export default PuzzleSolver;
