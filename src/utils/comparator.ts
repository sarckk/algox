import { Comparator } from "./interfaces";

export class NumberComparator implements Comparator<number> {
    compare(a: number, b: number) {
        return a - b;
    }
}
