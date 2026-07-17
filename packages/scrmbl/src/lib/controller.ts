import { resolveCharset } from "./charsets";
import { prefersReducedMotion } from "./reduced-motion";
import { segment } from "./segment";
import { computePlan, frameAt, isScramblingAt, type Plan } from "./timeline";
import type { ResolvedOptions, ScrambleOptions } from "./types";

const DEFAULTS = {
  duration: 800,
  stagger: 20,
  order: "start",
  charset: "alnum",
  glyphRate: 30,
  ignore: "",
  scrambleAll: true,
  sweep: false,
  respectReducedMotion: true,
} satisfies ScrambleOptions;

/**
 * Framework-agnostic scramble engine. Attach it to an element, then call
 * `update()` with new text (or `replay()`) to animate. All framework
 * adapters are thin wrappers around this class.
 */
export class ScrambleController {
  private el: HTMLElement | null = null;
  private options: ScrambleOptions;
  private cells: HTMLSpanElement[] = [];
  private plan: Plan | null = null;
  private lastResolved: ResolvedOptions | null = null;
  private raf = 0;
  private t0 = 0;
  private current = "";
  private settled = true;

  constructor(options: ScrambleOptions = {}) {
    this.options = { ...options };
  }

  /** The text the controller currently targets/displays. */
  get text(): string {
    return this.current;
  }

  /** Whether an animation is currently running. */
  get animating(): boolean {
    return !this.settled;
  }

  /**
   * Bind to an element. Adopts the element's existing text content as the
   * current text. Safe to call only in the browser.
   */
  attach(el: HTMLElement, options?: ScrambleOptions): this {
    this.el = el;
    if (options) Object.assign(this.options, options);
    this.current = el.textContent ?? "";
    el.setAttribute("data-scrmbl", "");
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", this.current);
    // Keep runs of spaces intact while cells swap in and out.
    if (typeof getComputedStyle === "function" && getComputedStyle(el).whiteSpace === "normal") {
      el.style.whiteSpace = "pre-wrap";
    }
    return this;
  }

  /** Merge new default options for subsequent animations. */
  setOptions(options: ScrambleOptions): this {
    Object.assign(this.options, options);
    return this;
  }

  /** Animate from whatever is currently displayed to `text`. */
  update(text: string, overrides?: ScrambleOptions): void {
    const el = this.el;
    if (!el) {
      this.current = text;
      return;
    }
    const o = this.resolve(overrides);
    el.setAttribute("aria-label", text);

    if (o.respectReducedMotion && prefersReducedMotion()) {
      this.snap(text, o);
      return;
    }

    const from = segment(this.displayed());
    const to = segment(text);
    if (from.length === 0 && to.length === 0) {
      this.snap(text, o);
      return;
    }

    this.plan = computePlan(from, to, o);
    this.lastResolved = o;
    this.current = text;
    this.buildCells(Math.max(from.length, to.length), from);
    this.settled = false;
    el.setAttribute("data-scrmbl-active", "");
    o.onStart?.();

    cancelAnimationFrame(this.raf);
    this.t0 = performance.now();
    const step = (now: number) => {
      const plan = this.plan;
      if (!plan) return;
      const t = now - this.t0;
      const glyphs = frameAt(plan, t);
      for (let i = 0; i < this.cells.length; i++) {
        const span = this.cells[i];
        const g = glyphs[i];
        if (span.textContent !== g) span.textContent = g;
        const scrambling = isScramblingAt(plan, plan.cells[i], t);
        if (scrambling !== span.hasAttribute("data-glyph")) {
          if (scrambling) span.setAttribute("data-glyph", "");
          else span.removeAttribute("data-glyph");
        }
      }
      if (t >= plan.total) {
        this.settle();
        return;
      }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  /** Re-scramble the current text in from nothing. */
  replay(overrides?: ScrambleOptions): void {
    const text = this.current;
    if (this.el) {
      this.cells = [];
      this.el.textContent = "";
    }
    this.update(text, overrides);
  }

  /** Jump straight to the final text. */
  finish(): void {
    if (!this.settled) this.settle();
  }

  /** Halt in place (mid-scramble glyphs stay visible). */
  stop(): void {
    cancelAnimationFrame(this.raf);
  }

  /** Stop and release the element. */
  destroy(): void {
    cancelAnimationFrame(this.raf);
    this.plan = null;
    this.cells = [];
    this.el = null;
    this.settled = true;
  }

  // --- internals ---------------------------------------------------------

  private resolve(overrides?: ScrambleOptions): ResolvedOptions {
    const merged = { ...DEFAULTS, ...this.options, ...overrides };
    return {
      duration: merged.duration,
      stagger: merged.stagger,
      order: merged.order,
      charsetArr: resolveCharset(merged.charset),
      glyphRate: merged.glyphRate,
      ignore: merged.ignore,
      scrambleAll: merged.scrambleAll,
      sweep: merged.sweep,
      seed: merged.seed ?? Math.floor(Math.random() * 0x7fffffff),
      respectReducedMotion: merged.respectReducedMotion,
      onStart: merged.onStart,
      onComplete: merged.onComplete,
    };
  }

  /** What the element is showing right now (handles mid-animation updates). */
  private displayed(): string {
    if (this.cells.length > 0 && this.cells[0].isConnected) {
      return this.cells.map((c) => c.textContent ?? "").join("");
    }
    return this.el?.textContent ?? "";
  }

  private buildCells(count: number, from: string[]): void {
    const el = this.el;
    if (!el) return;
    el.textContent = "";
    this.cells = Array.from({ length: count }, (_, i) => {
      const span = document.createElement("span");
      span.setAttribute("data-scrmbl-cell", "");
      span.setAttribute("aria-hidden", "true");
      span.textContent = from[i] ?? "";
      el.appendChild(span);
      return span;
    });
  }

  private settle(): void {
    cancelAnimationFrame(this.raf);
    const el = this.el;
    if (el) {
      // Flatten back to plain text: copy/paste, SEO, and wrapping all behave.
      el.textContent = this.current;
      el.removeAttribute("data-scrmbl-active");
    }
    this.cells = [];
    this.plan = null;
    this.settled = true;
    this.lastResolved?.onComplete?.();
  }

  private snap(text: string, o: ResolvedOptions): void {
    this.current = text;
    this.cells = [];
    this.plan = null;
    this.settled = true;
    if (this.el) {
      this.el.textContent = text;
      this.el.removeAttribute("data-scrmbl-active");
    }
    o.onStart?.();
    o.onComplete?.();
  }
}
