import { Comparator } from "./interfaces";

export class MinPQ<T> {
    private heap: T[];
    private comparator: Comparator<T>;

    constructor(comparator: Comparator<T>) {
        this.heap = [];
        this.heap.push(null);
        this.comparator = comparator;
    }

    insert(key: T): void {
        this.heap.push(key);
        this.swim(this.heap.length - 1);
    }

    delMin(): T {
        if (this.isEmpty()) {
            return;
        }

        const min = this.heap[1];
        this.swap(this.heap.length - 1, 1);
        this.heap.pop();
        this.sink(1);
        return min;
    }

    min(): T {
        if (this.isEmpty()) {
            return;
        }
        return this.heap[1];
    }

    isEmpty(): boolean {
        return this.heap.length === 1;
    }

    // Heap helper functions
    private sink(index: number): void {
        let heap = this.heap;
        while (index * 2 <= heap.length - 1) {
            let smallestChildIdx = index * 2;

            if (
                smallestChildIdx < heap.length - 1 &&
                this.greater(heap[smallestChildIdx], heap[smallestChildIdx + 1])
            ) {
                smallestChildIdx++;
            }

            if (this.greater(heap[smallestChildIdx], heap[index])) {
                break;
            }

            this.swap(index, smallestChildIdx);
            index = smallestChildIdx;
        }
    }

    private swim(index: number): void {
        let currentIdx = index;

        while (
            currentIdx > 1 &&
            this.greater(
                this.heap[Math.floor(currentIdx / 2)],
                this.heap[currentIdx]
            )
        ) {
            const parentIdx = Math.floor(currentIdx / 2);
            this.swap(parentIdx, currentIdx);
            currentIdx = parentIdx;
        }
    }

    // Array helper functions
    private greater(a: T, b: T): boolean {
        const cmp = this.comparator.compare(a, b);
        return cmp > 0;
    }

    private swap(from: number, to: number): void {
        [this.heap[from], this.heap[to]] = [this.heap[to], this.heap[from]];
    }
}
