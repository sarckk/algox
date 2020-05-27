import { MinPQ } from "../MinPQ";

describe("MinPQ", () => {
    it("isEmpty() returns false for non-empty PQ", () => {
        let mpq = new MinPQ();
        mpq.insert(2);
        expect(mpq.isEmpty()).toBe(false);
    });

    it("isEmpty() returns true for empty PQ", () => {
        let mpq = new MinPQ();
        expect(mpq.isEmpty()).toBe(true);
    });

    it("min() returns correct value", () => {
        let mpq = new MinPQ();
        mpq.insert(2);
        mpq.insert(8);
        mpq.insert(4);
        const first = mpq.min();
        expect(first).toBe(2);
        const second = mpq.min();
        expect(second).toBe(2);
    });

    it("min() doesnt' do anything if empty", () => {
        let mpq = new MinPQ();
        expect(mpq.min()).toBe(undefined);
    });

    it("min() returns next smallest after delMin()", () => {
        let mpq = new MinPQ();
        mpq.insert(2);
        mpq.insert(8);
        mpq.insert(4);
        const first = mpq.delMin();
        expect(first).toBe(2);
        const second = mpq.min();
        expect(second).toBe(4);
    });

    it("delMin() returns correct value and deletes", () => {
        let mpq = new MinPQ();
        let results = [];

        mpq.insert(2);
        mpq.insert(4);
        mpq.insert(1);
        mpq.insert(3);

        for (let i = 0; i < 4; i++) {
            results.push(mpq.delMin());
        }

        expect(results).toEqual([1, 2, 3, 4]);
        expect(mpq.isEmpty()).toBe(true);
    });

    it("delMin() doesn't do anything if empty", () => {
        let mpq = new MinPQ();
        expect(mpq.delMin()).toBe(undefined);
    });
});
