import { orderFactors } from "./orders";
import { createRng, hash01 } from "./prng";
import { isWhitespace } from "./segment";
import type { ResolvedOptions } from "./types";

export interface CellPlan {
  /** Grapheme displayed before this cell's animation begins. */
  from: string;
  /** Grapheme this cell resolves to ("" means the cell disappears). */
  to: string;
  /** ms after start at which this cell begins resolving. */
  delay: number;
  /** ms after start at which this cell locks to `to`. */
  lock: number;
  /** Static cells never display random glyphs. */
  isStatic: boolean;
}

export interface Plan {
  cells: CellPlan[];
  /** Total duration in ms; every cell has locked by this time. */
  total: number;
  /** ms per glyph swap. */
  glyphMs: number;
  charset: string[];
  seed: number;
  sweep: boolean;
}

/**
 * Build the full animation plan for a transition between two grapheme arrays.
 * Pure: same inputs → same plan.
 *
 * Timing model: a stagger budget (capped at 80% of `duration`) spreads cell
 * start times according to `order`; every cell then scrambles for the same
 * remaining time, so the whole animation always completes at `duration`.
 */
export function computePlan(from: string[], to: string[], o: ResolvedOptions): Plan {
  const n = Math.max(from.length, to.length);
  const rng = createRng(o.seed);
  const factors = orderFactors(n, o.order, rng);
  const staggerBudget = n > 1 ? Math.min(o.stagger * (n - 1), o.duration * 0.8) : 0;
  const scrambleMs = Math.max(o.duration - staggerBudget, 40);
  const ignoreSet = new Set(Array.from(o.ignore));

  const cells: CellPlan[] = Array.from({ length: n }, (_, i) => {
    const fromG = from[i] ?? "";
    const toG = to[i] ?? "";
    const delay = factors[i] * staggerBudget;
    const inert = toG !== "" && (isWhitespace(toG) || ignoreSet.has(toG));
    const unchanged = fromG === toG;
    const isStatic = inert || (unchanged && !o.scrambleAll) || (fromG === "" && toG === "");
    return { from: fromG, to: toG, delay, lock: delay + scrambleMs, isStatic };
  });

  return {
    cells,
    total: staggerBudget + scrambleMs,
    glyphMs: 1000 / o.glyphRate,
    charset: o.charsetArr,
    seed: o.seed,
    sweep: o.sweep,
  };
}

/** Whether a cell is showing a random glyph (vs. its from/to grapheme) at `t`. */
export function isScramblingAt(plan: Plan, cell: CellPlan, t: number): boolean {
  if (cell.isStatic) return false;
  if (t >= cell.lock) return false;
  if (plan.sweep && t < cell.delay) return false;
  return true;
}

/**
 * The grapheme every cell displays at time `t` (ms since start).
 * Pure: rendering an animation is just evaluating this over time.
 */
export function frameAt(plan: Plan, t: number): string[] {
  return plan.cells.map((cell, i) => {
    if (cell.isStatic) {
      return plan.sweep && t < cell.delay ? cell.from : cell.to;
    }
    if (t >= cell.lock) return cell.to;
    if (plan.sweep && t < cell.delay) return cell.from;
    const tick = Math.floor(Math.max(t, 0) / plan.glyphMs);
    const r = hash01(plan.seed, i, tick);
    return plan.charset[Math.floor(r * plan.charset.length)] ?? cell.to;
  });
}
