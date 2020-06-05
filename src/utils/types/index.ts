import { Node } from "../../components/PuzzleApp/model/Node";

export enum AlgorithmType {
    A_STAR = "A_STAR",
    ID_A_STAR = "ID_A_STAR",
}

export enum HeuristicType {
    MANHATTAN = "MANHATTAN",
    LINEAR_CONFLICT = "LINEAR_CONFLICT",
    WALKING_DISTANCE = "WALKING_DISTANCE",
    PATTERN_DB = "PATTERN_DB",
}

export enum MoveDirection {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export interface Comparator<T> {
    compare(a: T, b: T): number;
}

export type HeuristicFunction = (node: Node) => number;

export interface Solver {
    solve(node: Node): Promise<[Node[], number]>;
}
