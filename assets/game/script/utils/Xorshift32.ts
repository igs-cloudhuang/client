/**
 * hash
 */
export function xorshift32(seed: number): number {
    let x = seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return x;
}
