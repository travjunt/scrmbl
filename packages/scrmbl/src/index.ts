import { ScrambleController } from "./lib/controller";
import type { ScrambleOptions } from "./lib/types";

export { ScrambleController } from "./lib/controller";
export { CHARSETS, resolveCharset } from "./lib/charsets";
export { computePlan, frameAt, isScramblingAt } from "./lib/timeline";
export type { CellPlan, Plan } from "./lib/timeline";
export { segment } from "./lib/segment";
export type {
  CharsetPreset,
  ResolveOrder,
  ResolvedOptions,
  ScrambleOptions,
} from "./lib/types";

/**
 * One-liner vanilla API: scramble an element's existing text in.
 *
 * ```ts
 * import { scramble } from "scrmbl";
 * const ctrl = scramble(document.querySelector("h1")!);
 * ctrl.update("New headline");
 * ```
 */
export function scramble(el: HTMLElement, options: ScrambleOptions = {}): ScrambleController {
  const controller = new ScrambleController(options);
  controller.attach(el);
  controller.replay();
  return controller;
}
