import { Node } from "../model/Node";

function swap(arr: number[], from: number, to: number): number[] {
    let arrCpy = arr.slice();
    [arrCpy[from], arrCpy[to]] = [arrCpy[to], arrCpy[from]];
    return arrCpy;
}

describe("Node class", () => {
    it("Correct manhattan distance calculated", () => {
        const tiles: number[] = [
            1,
            2,
            3,
            4,
            6,
            10,
            7,
            8,
            5,
            0,
            11,
            12,
            9,
            13,
            14,
            15,
        ];
        const node: Node = new Node(tiles, 0, null);
        expect(node.heuristicScore).toBe(7);
    });

    it(".solved returns true for solved board", () => {
        const tiles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        const node: Node = new Node(tiles, 0, null);
        expect(node.solved).toBe(true);
    });

    it(".solved returns false for unsolved board", () => {
        const node: Node = new Node(
            [1, 6, 2, 4, 5, 0, 3, 8, 9, 10, 7, 11, 13, 14, 15, 12],
            0,
            null
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
        const node: Node = new Node(tiles, 0, null);
        const neighbors: Node[] = node.getNeighbours();
        const correctNeighbors: Node[] = [
            new Node(swap(tiles, 3, 7), 1, node),
            new Node(swap(tiles, 3, 2), 1, node),
        ];

        for (let i = 0; i < neighbors.length; i++) {
            expect(neighbors[i]).toEqual(correctNeighbors[i]);
        }
    });

    describe("A Star Algorithm", () => {
        let node: Node;

        beforeEach(() => {
            node = new Node(
                [1, 8, 3, 0, 5, 7, 4, 12, 14, 6, 2, 15, 9, 13, 10, 11],
                0,
                null
            );
        });

        it("Returns path of correct length", () => {
            const path = node.aStar();
            expect(path.length).toBe(30);
        });
    });
});
