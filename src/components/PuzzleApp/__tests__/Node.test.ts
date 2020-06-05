import { Node } from "../model/Node";
import { Move } from "../model/Move";
import { HeuristicType, MoveDirection } from "../../../utils/types";

function swap(arr: number[], from: number, to: number): number[] {
    let arrCpy = arr.slice();
    [arrCpy[from], arrCpy[to]] = [arrCpy[to], arrCpy[from]];
    return arrCpy;
}

describe("Node class", () => {
    it(".solved returns true for solved board", () => {
        const tiles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        const node: Node = new Node(tiles, 0, null, HeuristicType.MANHATTAN);
        expect(node.solved).toBe(true);
    });

    it(".solved returns false for unsolved board", () => {
        const node: Node = new Node(
            [1, 6, 2, 4, 5, 0, 3, 8, 9, 10, 7, 11, 13, 14, 15, 12],
            0,
            null,
            HeuristicType.MANHATTAN
        );
        expect(node.solved).toBe(false);
    });

    it("Neighbors of node are correct", () => {
        const tiles: number[] = [
            1,
            8,
            3,
            0,
            5,
            7,
            4,
            12,
            14,
            6,
            2,
            15,
            9,
            13,
            10,
            11,
        ];
        const node: Node = new Node(tiles, 0, null, HeuristicType.MANHATTAN);
        const neighbors: Node[] = node.expand();
        const correctNeighbors: Node[] = [
            new Node(
                swap(tiles, 3, 7),
                1,
                node,
                HeuristicType.MANHATTAN,
                new Move(12, MoveDirection.UP)
            ),
            new Node(
                swap(tiles, 3, 2),
                1,
                node,
                HeuristicType.MANHATTAN,
                new Move(3, MoveDirection.RIGHT)
            ),
        ];

        for (let i = 0; i < neighbors.length; i++) {
            expect(neighbors[i]).toEqual(correctNeighbors[i]);
        }
    });
});
