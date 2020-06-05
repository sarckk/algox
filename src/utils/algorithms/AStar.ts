import { Node } from "../../components/PuzzleApp/model/Node";
import { Solver, HeuristicType, Comparator } from "../types";
import { MinPQ } from "../MinPQ";
import { arrayEquals } from "../helper";

export class AStar implements Solver {
    h: HeuristicType;

    setHeuristic(h: HeuristicType) {
        this.h = h;
    }

    solve(node: Node): Promise<[Node[], number]> {
        // Run A* with Manhattan heurjstics
        return new Promise((resolve, reject) => {
            let mpq: MinPQ<Node> = new MinPQ<Node>(this.HeuristicComparator);
            mpq.insert(node);
            let current: Node;
            let numNodesExplored = 0;

            while (!mpq.isEmpty()) {
                current = mpq.delMin();
                numNodesExplored++;

                if (current.solved) {
                    break;
                }

                for (let neighbor of current.expand()) {
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

            while (current.prev !== null) {
                path.push(current);
                current = current.prev;
            }

            console.log("Nodes explored: ", numNodesExplored);

            resolve([path.reverse(), numNodesExplored]);
        });
    }

    private HeuristicComparator: Comparator<Node> = new (class {
        compare = (a: Node, b: Node): number => {
            return a.moves + a.hScore - (b.moves + b.hScore);
        };
    })();
}
