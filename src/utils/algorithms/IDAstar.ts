import { Node } from "../../components/PuzzleApp/model/Node";
import { Solver } from "../types";

const FOUND = -100;

export class IDAStar implements Solver {
    numNodesExplored: number;

    constructor() {
        this.numNodesExplored = 1;
    }

    solve(start: Node): Promise<[Node[], number]> {
        // Iterative deepening A*
        // Guarantees optimal path with same big O time complexity
        // But with linear space complexity
        return new Promise((resolve, reject) => {
            let bound = start.hScore;
            let path = [start];

            while (true) {
                const temp = this.boundedSearch(path, 0, bound);
                if (temp === FOUND) {
                    console.log("Num nodes explored: ", this.numNodesExplored);
                    resolve([path.slice(1), this.numNodesExplored]);
                    break;
                }
                if (temp === Infinity) {
                    resolve([[], 0] as [Node[], number]);
                    break;
                }
                bound = temp;
            }
        });
    }

    private boundedSearch(path: Node[], moves: number, bound: number): number {
        let node = path[path.length - 1];
        let priority = moves + node.hScore;
        if (priority > bound) {
            return priority;
        }
        if (node.solved) {
            return FOUND;
        }
        let currentMin = Infinity;

        for (let neighbor of node.expand()) {
            if (path.includes(neighbor)) {
                continue;
            }
            this.numNodesExplored = this.numNodesExplored + 1;

            path.push(neighbor);
            const temp = this.boundedSearch(path, moves + 1, bound);
            if (temp === FOUND) {
                return FOUND;
            }
            if (temp < currentMin) {
                currentMin = temp;
            }
            path.pop();
        }

        return currentMin;
    }
}
