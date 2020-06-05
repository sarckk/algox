import { MoveDirection } from "../../../utils/types";

export class Move {
    affectedCell: number;
    direction: MoveDirection;

    constructor(affectedCell: number, direction: MoveDirection) {
        this.affectedCell = affectedCell;
        this.direction = direction;
    }

    toString() {
        return `(${this.affectedCell}, ${this.direction})`;
    }
}
