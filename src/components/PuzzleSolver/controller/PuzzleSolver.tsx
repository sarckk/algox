import React, { ChangeEvent } from "react";
import { Selector } from "../view/Selector";
import { Buttons } from "../view/Buttons";
import { Board } from "../view/Board";
import { shuffle } from "../../../utils/helper";
import { BoardInfo } from "../view/BoardInfo";
import Confetti from "react-dom-confetti";
import { Node } from "../model/Node";
import { HashedModuleIdsPlugin } from "webpack";

export enum SolverStatus {
    IDLE,
    SOLVING,
    SOLVED,
}

interface PuzzleSolverState {
    currentNode: Node;
    isSolvable: boolean;
    solverStatus: SolverStatus;
    solutionPath: Node[];
    timeTaken: number;
    savedNode: Node;
    numSteps: number;
}

class PuzzleSolver extends React.Component<any, PuzzleSolverState> {
    animationSpeed: number;
    turnOffSolutionTimeout: number;
    pathLength: number;

    constructor(props: any) {
        super(props);

        const initialDimension = 2;
        let tiles = [...Array(initialDimension ** 2).keys()];
        let shuffledTiles = shuffle(tiles);
        const isSolvable = this.isSolvable(shuffledTiles);
        const startNode = new Node(shuffledTiles, 0, null);

        this.state = {
            currentNode: startNode,
            isSolvable,
            solverStatus: SolverStatus.IDLE,
            solutionPath: null,
            timeTaken: null,
            savedNode: null,
            numSteps: null,
        };

        this.generateNewTiles = this.generateNewTiles.bind(this);
        this.solve = this.solve.bind(this);
        this.restart = this.restart.bind(this);
        this.swap = this.swap.bind(this);
        this.animationSpeed = 150; // in ms
    }

    componentDidUpdate() {
        const solutionPath = this.state.solutionPath;
        if (solutionPath === null) {
            return;
        }

        if (solutionPath.length !== 0) {
            this.turnOffSolutionTimeout = window.setTimeout(() => {
                const nextNodeState = solutionPath[solutionPath.length - 1];
                const poppedSolutionPath = solutionPath.slice(
                    0,
                    solutionPath.length - 1
                );

                this.setState({
                    currentNode: nextNodeState,
                    solutionPath: poppedSolutionPath,
                    numSteps: this.pathLength - poppedSolutionPath.length - 1,
                });
            }, this.animationSpeed);
        } else {
            this.setState({
                currentNode: new Node(this.state.currentNode.tiles, 0, null),
                savedNode: this.state.currentNode,
                solutionPath: null,
                solverStatus: SolverStatus.SOLVED,
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.turnOffSolutionTimeout);
    }

    generateNewTiles(e?: ChangeEvent<HTMLSelectElement>): void {
        if (this.turnOffSolutionTimeout) {
            clearTimeout(this.turnOffSolutionTimeout);
        }

        let shuffledTile: number[];

        if (e.target.value) {
            const newDimension = Number(e.target.value);
            let tiles = [...Array(newDimension ** 2).keys()];
            shuffledTile = shuffle(tiles);
        } else {
            shuffledTile = shuffle(this.state.currentNode.tiles);
        }

        const isSolvable = this.isSolvable(shuffledTile);
        const newNode = new Node(shuffledTile, 0, null);

        this.setState({
            currentNode: newNode,
            isSolvable,
            solutionPath: null,
            savedNode: null,
            solverStatus: SolverStatus.IDLE,
        });

        this.resetStats();
    }

    solve() {
        const startTime = new Date().getTime();
        let path: Node[] = this.state.currentNode.aStar();
        const endTime = new Date().getTime();
        const timeTaken = endTime - startTime;
        this.pathLength = path.length;

        this.setState({
            solutionPath: path,
            timeTaken,
            solverStatus: SolverStatus.SOLVING,
        });
    }

    restart() {
        const startTime = new Date().getTime();
        let path: Node[] = this.state.savedNode.aStar();
        const endTime = new Date().getTime();
        const timeTaken = endTime - startTime;

        this.setState({
            solutionPath: path,
            timeTaken,
            solverStatus: SolverStatus.SOLVING,
        });
    }

    findBlankIndex(tiles: number[]): number {
        return tiles.indexOf(0);
    }

    isMovable(index: number): boolean {
        let movableIndices: number[] = [];
        const tiles: number[] = this.state.currentNode.tiles;

        const blankIndex = this.findBlankIndex(tiles);
        const dimension = Math.sqrt(tiles.length);

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

        if (blankIndex < tiles.length - dimension) {
            // blank is not at the top of board
            movableIndices.push(blankIndex + dimension);
        }

        return movableIndices.includes(index);
    }

    resetStats() {
        this.setState({
            timeTaken: null,
            numSteps: 0,
        });
    }

    swap(index: number): void {
        const currentTiles = this.state.currentNode.tiles;
        const blankIndex = this.findBlankIndex(currentTiles);

        if (this.isMovable(index)) {
            let tilesClone = currentTiles.slice();
            [tilesClone[index], tilesClone[blankIndex]] = [
                tilesClone[blankIndex],
                tilesClone[index],
            ];

            const newNode = new Node(tilesClone, 0, null);

            this.setState({
                currentNode: newNode,
                solverStatus: SolverStatus.IDLE,
            });

            this.resetStats();
        }
    }

    inversions(tiles: number[]): number {
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

        return inversions;
    }

    isSolvable(tiles: number[]): boolean {
        const inversions = this.inversions(tiles);
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
        const msTaken = this.state.timeTaken;
        const inversions = this.inversions(this.state.currentNode.tiles);
        const isSolvable = this.state.isSolvable;
        const solverStatus = this.state.solverStatus;

        return (
            <div className="flex">
                <div className="flex flex-col items-center justify-center">
                    <Selector onOptionChange={this.generateNewTiles} />
                    <Board
                        tiles={this.state.currentNode.tiles}
                        swapFn={this.swap}
                    />
                    <Confetti
                        active={this.state.currentNode.solved}
                        config={{ dragFriction: 0.15 }}
                    />
                    <Buttons
                        isSolvable={isSolvable}
                        solverStatus={solverStatus}
                        randBtnOnClick={this.generateNewTiles}
                        solveBtnOnClick={this.solve}
                        restartBtnOnClick={this.restart}
                    />
                </div>
                <div className="flex-grow ml-10">
                    <BoardInfo
                        msTaken={msTaken}
                        isSolvable={isSolvable}
                        solverStatus={solverStatus}
                        inversions={inversions}
                        manhattan={this.state.currentNode.heuristicScore}
                        numSteps={this.state.numSteps}
                    />
                </div>
            </div>
        );
    }
}

export default PuzzleSolver;
