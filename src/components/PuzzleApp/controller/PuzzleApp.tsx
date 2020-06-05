import React, { ChangeEvent } from "react";
import { Selector } from "../view/Selector";
import { Buttons } from "../view/Buttons";
import { Board } from "../view/Board";
import { setStateAsync, shuffle } from "../../../utils/helper";
import { BoardInfo } from "../view/BoardInfo";
import Confetti from "react-dom-confetti";
import { Node } from "../model/Node";
import { AlgorithmType, HeuristicType } from "../../../utils/types";
import { PuzzleSolver } from "../model/PuzzleSolver";
import { Move } from "../model/Move";

export enum SolverStatus {
    IDLE,
    SOLVING,
    ANIMATING,
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
    algorithmType: AlgorithmType;
    heuristicType: HeuristicType;
    solutionMoves: Move[];
    numNodesExplored: number;
}

class PuzzleApp extends React.Component<any, PuzzleSolverState> {
    animationSpeed: number;
    turnOffSolutionTimeout: number;
    pathLength: number;

    constructor(props: any) {
        super(props);

        const initialDimension = 2;
        let tiles = [...Array(initialDimension ** 2).keys()];
        let shuffledTiles = shuffle(tiles);
        const isSolvable = this.isSolvable(shuffledTiles);
        const startNode = new Node(
            shuffledTiles,
            0,
            null,
            HeuristicType.MANHATTAN
        );

        this.state = {
            currentNode: startNode,
            savedNode: startNode,
            isSolvable,
            solverStatus: SolverStatus.IDLE,
            solutionPath: null,
            timeTaken: null,
            numSteps: null,
            algorithmType: AlgorithmType.A_STAR,
            heuristicType: HeuristicType.MANHATTAN,
            solutionMoves: null,
            numNodesExplored: null,
        };

        this.generateNewTiles = this.generateNewTiles.bind(this);
        this.solve = this.solve.bind(this);
        this.restart = this.restart.bind(this);
        this.swap = this.swap.bind(this);
        this.changeAlgorithm = this.changeAlgorithm.bind(this);
        this.changeHeuristic = this.changeHeuristic.bind(this);
        this.animationSpeed = 150; // in ms
    }

    componentDidUpdate() {
        const solutionPath = this.state.solutionPath;
        if (solutionPath === null) {
            return;
        }

        if (solutionPath.length !== 0) {
            this.turnOffSolutionTimeout = window.setTimeout(() => {
                const nextNodeState = solutionPath[0];
                const poppedSolutionPath = solutionPath.slice(1);

                this.setState({
                    currentNode: nextNodeState,
                    solutionPath: poppedSolutionPath,
                });
            }, this.animationSpeed);
        } else {
            this.setState({
                currentNode: new Node(
                    this.state.currentNode.tiles,
                    0,
                    null,
                    this.state.heuristicType
                ),
                solutionPath: null,
                solverStatus: SolverStatus.SOLVED,
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.turnOffSolutionTimeout);
    }

    async solve() {
        let puzzleSolver = new PuzzleSolver(
            this.state.currentNode,
            this.state.algorithmType
        );

        try {
            await setStateAsync({ solverStatus: SolverStatus.SOLVING }, this);
            const startTime = new Date().getTime();
            const solution = await puzzleSolver.solve();
            const endTime = new Date().getTime();
            const timeTaken = endTime - startTime;

            const solutionPath = solution[0];
            const numNodesExplored = solution[1];

            this.pathLength = solutionPath.length;

            const solutionMoves = solutionPath.map((n) => n.move);

            this.setState({
                solutionPath,
                timeTaken,
                solverStatus: SolverStatus.ANIMATING,
                solutionMoves,
                numSteps: solutionPath.length,
                numNodesExplored,
            });
        } catch (timeoutError) {
            alert("ERROR: " + timeoutError.message);
        }
    }

    restart() {
        this.setState({
            currentNode: this.state.savedNode,
            solverStatus: SolverStatus.IDLE,
            timeTaken: null,
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
            numSteps: null,
            numNodesExplored: null,
        });
    }

    swap(index: number): void {
        if (this.state.solverStatus === SolverStatus.SOLVING) {
            return;
        }

        const currentTiles = this.state.currentNode.tiles;
        const blankIndex = this.findBlankIndex(currentTiles);

        if (this.isMovable(index)) {
            let tilesClone = currentTiles.slice();
            [tilesClone[index], tilesClone[blankIndex]] = [
                tilesClone[blankIndex],
                tilesClone[index],
            ];

            const newNode = new Node(
                tilesClone,
                0,
                null,
                this.state.heuristicType
            );

            if (newNode.solved) {
                this.setState({
                    currentNode: newNode,
                    solverStatus: SolverStatus.SOLVED,
                });
            } else {
                this.setState({
                    currentNode: newNode,
                    solverStatus: SolverStatus.IDLE,
                });
            }

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
        const newNode = new Node(
            shuffledTile,
            0,
            null,
            this.state.heuristicType
        );

        this.setState({
            currentNode: newNode,
            isSolvable,
            solutionPath: null,
            savedNode: newNode,
            solverStatus: SolverStatus.IDLE,
            solutionMoves: null,
        });

        this.resetStats();
    }

    changeAlgorithm(e: ChangeEvent<HTMLSelectElement>) {
        if (this.turnOffSolutionTimeout) {
            clearTimeout(this.turnOffSolutionTimeout);
        }

        const alg = e.target.value as AlgorithmType;

        this.setState({
            algorithmType: alg,
            solverStatus: SolverStatus.IDLE,
        });

        this.resetStats();
    }

    changeHeuristic(e: ChangeEvent<HTMLSelectElement>) {
        if (this.turnOffSolutionTimeout) {
            clearTimeout(this.turnOffSolutionTimeout);
        }

        const h = e.target.value as HeuristicType;
        const n = this.state.currentNode;
        const savedNode = this.state.savedNode;
        savedNode.setHeuristic(h);

        this.setState({
            currentNode: new Node(n.tiles, n.moves, n.prev, h),
            heuristicType: h,
            solverStatus: SolverStatus.IDLE,
            savedNode,
        });

        this.resetStats();
    }

    render() {
        const msTaken = this.state.timeTaken;
        const inversions = this.inversions(this.state.currentNode.tiles);
        const isSolvable = this.state.isSolvable;
        const solverStatus = this.state.solverStatus;

        return (
            <div className="flex">
                <div className="flex flex-col items-center justify-center">
                    <Selector
                        onDimensionChange={this.generateNewTiles}
                        onAlgorithmChange={this.changeAlgorithm}
                        onHeuristicChange={this.changeHeuristic}
                    />
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
                <BoardInfo
                    msTaken={msTaken}
                    isSolvable={isSolvable}
                    solverStatus={solverStatus}
                    inversions={inversions}
                    hScore={this.state.currentNode.hScore}
                    numSteps={this.state.numSteps}
                    moves={this.state.solutionMoves}
                    numNodesExplored={this.state.numNodesExplored}
                />
            </div>
        );
    }
}

export default PuzzleApp;
