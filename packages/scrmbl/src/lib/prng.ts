/**
 * Deterministic 32-bit PRNG (mulberry32). Tiny, fast, good enough for
 * visual shuffling — not for cryptography.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Stateless hash of (seed, cell, tick) → [0, 1). Lets every animation frame
 * be computed as a pure function of time: no per-frame mutable state, and a
 * given seed always replays the exact same glyph sequence.
 */
export function hash01(seed: number, cell: number, tick: number): number {
  let h = (seed ^ Math.imul(cell + 1, 0x9e3779b1) ^ Math.imul(tick + 1, 0x85ebca6b)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}
