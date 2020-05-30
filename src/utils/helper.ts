/**
 * Useful helper utility functions
 */

export function arrayEquals(a: any[], b: any[]): boolean {
    return a.every((elem, index) => elem === b[index]);
}

export function shuffle<T>(a: T[]): T[] {
    let newA = [...a];

    // Knuth shuffle, but returns new shuffled array
    for (let i = 1; i < newA.length; i++) {
        const r = Math.floor(Math.random() * (i + 1));
        [newA[i], newA[r]] = [newA[r], newA[i]];
    }

    return newA;
}
