import { AlgorithmType, Solver } from "../../../utils/types";
import { Node } from "./Node";
import { IDAStar } from "../../../utils/algorithms/IDAstar";
import { AStar } from "../../../utils/algorithms/AStar";

export class PuzzleSolver {
    start: Node;
    solver: Solver;

    constructor(start: Node, algorithm: AlgorithmType) {
        this.start = start;
        let solver;

        switch (algorithm) {
            case AlgorithmType.A_STAR:
                solver = new AStar();
                break;
            case AlgorithmType.ID_A_STAR:
                solver = new IDAStar();
                break;
        }

        this.solver = solver;
    }

    solve() {
        return this.solver.solve(this.start);
    }
}
