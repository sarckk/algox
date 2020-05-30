import { Comparator } from "../../../utils/interfaces";
import { MinPQ } from "../../../utils/MinPQ";
import { arrayEquals } from "../../../utils/helper";

export class Node {
    tiles: number[];
    prev: Node;
    moves: number;
    heuristicScore: number;
    priority: number;
    solved: boolean;

    constructor(tiles: number[], moves: number, prev: Node) {
        this.prev = prev;
        this.moves = moves;

        let manhattanScore = 0;

        let tilesCopy: number[] = [];

        tiles.forEach((value, index) => {
            tilesCopy[index] = value;

            if (value === 0) {
                return;
            }

            const dimension = Math.sqrt(tiles.length);
            const curRowEquiv = Math.floor(index / dimension);
            const correctRowEquiv = Math.floor((value - 1) / dimension);

            const curColEquiv = index % dimension;
            const correctColEquiv = (value - 1) % dimension;

            const rowDiff = Math.abs(correctRowEquiv - curRowEquiv);
            const colDiff = Math.abs(correctColEquiv - curColEquiv);

            manhattanScore += rowDiff + colDiff;
        });

        this.tiles = tilesCopy;

        this.heuristicScore = manhattanScore;
        this.priority = this.heuristicScore + this.moves;
        this.solved = this.isSolved(tiles);
    }

    getTiles(): number[] {
        return this.tiles;
    }

    private exch(
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): Node {
        let swappedTiles = this.tiles.slice();

        const dimension = Math.sqrt(this.tiles.length);
        const fromIndex = fromRow * dimension + fromCol;
        const toIndex = toRow * dimension + toCol;

        const temp = swappedTiles[fromIndex];
        swappedTiles[fromIndex] = swappedTiles[toIndex];
        swappedTiles[toIndex] = temp;

        return new Node(swappedTiles, this.moves + 1, this);
    }

    getNeighbours(): Node[] {
        let neighbors: Node[] = [];
        const blankIndex = this.tiles.indexOf(0);
        const dimension = Math.sqrt(this.tiles.length);
        const rowEquiv = Math.floor(blankIndex / dimension);
        const colEquiv = blankIndex % dimension;

        if (rowEquiv + 1 < dimension)
            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv + 1, colEquiv)
            );
        if (rowEquiv - 1 >= 0)
            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv - 1, colEquiv)
            );
        if (colEquiv + 1 < dimension)
            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv, colEquiv + 1)
            );
        if (colEquiv - 1 >= 0)
            neighbors.push(
                this.exch(rowEquiv, colEquiv, rowEquiv, colEquiv - 1)
            );

        return neighbors;
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

        return arrayEquals(solvedTile, tiles);
    }

    aStar(): Node[] {
        // Run A* with Manhattan heuristics
        let mpq: MinPQ<Node> = new MinPQ<Node>(Node.NodeComparator);
        mpq.insert(this);
        let current: Node;

        while (!mpq.isEmpty()) {
            current = mpq.delMin();

            if (current.solved) {
                break;
            }

            for (let neighbor of current.getNeighbours()) {
                if (
                    current.prev !== null &&
                    arrayEquals(neighbor.tiles, current.prev.tiles)
                ) {
                    continue;
                }
                mpq.insert(neighbor);
            }
        }

        // Build up path
        let path = [];

        while (current !== null) {
            path.push(current);
            current = current.prev;
        }

        return path;
    }

    static NodeComparator: Comparator<Node> = new (class {
        compare(a: Node, b: Node): number {
            return a.priority - b.priority;
        }
    })();
}
