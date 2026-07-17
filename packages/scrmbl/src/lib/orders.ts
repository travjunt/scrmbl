import type { ResolveOrder } from "./types";

/**
 * For `n` cells, return a delay factor in [0, 1] per cell. 0 resolves first,
 * 1 resolves last.
 */
export function orderFactors(n: number, order: ResolveOrder, rng: () => number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const span = n - 1;
  const linear = (i: number) => i / span;

  switch (order) {
    case "end":
      return buildFactors(n, (i) => 1 - linear(i));
    case "center": {
      const mid = span / 2;
      return buildFactors(n, (i) => Math.abs(i - mid) / mid);
    }
    case "edges": {
      const mid = span / 2;
      return buildFactors(n, (i) => 1 - Math.abs(i - mid) / mid);
    }
    case "random": {
      const indices = Array.from({ length: n }, (_, i) => i);
      // Fisher–Yates with the provided rng for determinism under a seed.
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const factors = new Array<number>(n);
      indices.forEach((cell, rank) => {
        factors[cell] = rank / span;
      });
      return factors;
    }
    case "start":
    default:
      return buildFactors(n, linear);
  }
}

function buildFactors(n: number, fn: (i: number) => number): number[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}
