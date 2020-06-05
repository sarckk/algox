import { arrayEquals } from "../../../utils/helper";
import { HeuristicType, MoveDirection } from "../../../utils/types";
import { Move } from "./Move";

export class Node {
    tiles: number[];
    prev: Node;
    solved: boolean;
    moves: number;
    heuristic: HeuristicType;
    hScore: number;
    move: Move;

    constructor(
        tiles: number[],
        moves: number,
        prev: Node,
        heuristic: HeuristicType,
        move?: Move
    ) {
        this.prev = prev;
        this.tiles = tiles.slice();
        this.solved = this.isSolved();
        this.moves = moves;
        this.heuristic = heuristic;
        this.hScore = this.h();
        this.move = move ? move : null;
    }

    getTiles(): number[] {
        return this.tiles;
    }

    setMove(move: Move) {
        this.move = move;
    }

    setHeuristic(heuristic: HeuristicType) {
        this.heuristic = heuristic;
    }

    private exch(
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number,
        move: Move
    ): Node {
        let swappedTiles = this.tiles.slice();

        const dimension = Math.sqrt(this.tiles.length);
        const fromIndex = fromRow * dimension + fromCol;
        const toIndex = toRow * dimension + toCol;

        const temp = swappedTiles[fromIndex];
        swappedTiles[fromIndex] = swappedTiles[toIndex];
        swappedTiles[toIndex] = temp;

        const swappedNode = new Node(
            swappedTiles,
            this.moves + 1,
            this,
            this.heuristic
        );

        swappedNode.setMove(move);

        return swappedNode;
    }

    expand(): Node[] {
        let neighbors: Node[] = [];
        const blankIndex = this.tiles.indexOf(0);
        const dimension = Math.sqrt(this.tiles.length);
        const rowEquiv = Math.floor(blankIndex / dimension);
        const colEquiv = blankIndex % dimension;

        if (rowEquiv + 1 < dimension) {
            const affectedCell = this.tiles[blankIndex + dimension];
            const move = new Move(affectedCell, MoveDirection.UP);

            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv + 1, colEquiv, move)
            );
        }
        if (rowEquiv - 1 >= 0) {
            const affectedCell = this.tiles[blankIndex - dimension];
            const move = new Move(affectedCell, MoveDirection.DOWN);

            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv - 1, colEquiv, move)
            );
        }
        if (colEquiv + 1 < dimension) {
            const affectedCell = this.tiles[blankIndex + 1];
            const move = new Move(affectedCell, MoveDirection.LEFT);

            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv, colEquiv + 1, move)
            );
        }
        if (colEquiv - 1 >= 0) {
            const affectedCell = this.tiles[blankIndex - 1];
            const move = new Move(affectedCell, MoveDirection.RIGHT);

            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv, colEquiv - 1, move)
            );
        }

        return neighbors;
    }

    isSolved(): boolean {
        const solvedTile = [...Array(this.tiles.length).keys()].map(
            (tile, index) => {
                if (index === this.tiles.length - 1) {
                    return 0;
                }
                return tile + 1;
            }
        );

        return arrayEquals(solvedTile, this.tiles);
    }

    h() {
        const tiles = this.tiles;
        const dimension = Math.sqrt(tiles.length);

        if (this.heuristic === HeuristicType.WALKING_DISTANCE) {
            // calculate h here
            return -1;
        }
        if (this.heuristic === HeuristicType.PATTERN_DB) {
            // calculate h here
            return -1;
        }

        // Manhattan distance
        let dist = 0;
        tiles.forEach((value, index) => {
            if (value === 0) {
                return;
            }

            const curRowEquiv = Math.floor(index / dimension);
            const correctRowEquiv = Math.floor((value - 1) / dimension);

            const curColEquiv = index % dimension;
            const correctColEquiv = (value - 1) % dimension;

            const rowDiff = Math.abs(correctRowEquiv - curRowEquiv);
            const colDiff = Math.abs(correctColEquiv - curColEquiv);

            dist += rowDiff + colDiff;
        });

        // Add linear conflicts to Manhattan distance if required
        if (this.heuristic === HeuristicType.LINEAR_CONFLICT) {
            // Horizontal conflicts
            let horizConflict = 0;
            for (let row = 0; row < dimension; row++) {
                let max = 0;
                for (let col = 0; col < dimension; col++) {
                    const val = tiles[row * dimension + col];
                    const correctRowEquiv = Math.floor((val - 1) / dimension);
                    const correctColEquiv = (val - 1) / dimension;
                    if (val !== 0 && correctRowEquiv === row) {
                        let numTilesInConflict = 0;
                        for (let i = 0; i < col; i++) {
                            const tk = tiles[row * dimension + i];
                            const tkCorrectRow = Math.floor(
                                (tk - 1) / dimension
                            );
                            const tkCorrectCol = (tk - 1) / dimension;
                            if (
                                tkCorrectRow === row &&
                                correctColEquiv < tkCorrectCol
                            ) {
                                numTilesInConflict++;
                            }
                        }
                        if (numTilesInConflict > max) {
                            max = numTilesInConflict;
                        }
                    }
                }
                horizConflict += max;
            }

            // Vertical conflicts
            let vertConflict = 0;
            for (let col = 0; col < dimension; col++) {
                let max = 0;
                for (let row = 0; row < dimension; row++) {
                    const val = tiles[row * dimension + col];
                    const correctRowEquiv = Math.floor((val - 1) / dimension);
                    const correctColEquiv = (val - 1) / dimension;
                    if (val !== 0 && correctColEquiv === col) {
                        let numTilesInConflict = 0;
                        for (let i = 0; i < row; i++) {
                            const tk = tiles[row * dimension + i];
                            const tkCorrectRow = Math.floor(
                                (tk - 1) / dimension
                            );
                            const tkCorrectCol = (tk - 1) / dimension;
                            if (
                                tkCorrectCol === col &&
                                correctRowEquiv < tkCorrectRow
                            ) {
                                numTilesInConflict++;
                            }
                        }
                        if (numTilesInConflict > max) {
                            max = numTilesInConflict;
                        }
                    }
                }
                vertConflict += max;
            }

            const linearConflict = 2 * (horizConflict + vertConflict);
            dist += linearConflict;
        }

        return dist;
    }
}
