import type { CHARSETS } from "./charsets";

/** The direction/pattern characters resolve in. */
export type ResolveOrder = "start" | "end" | "center" | "edges" | "random";

/** Name of a built-in glyph pool. */
export type CharsetPreset = keyof typeof CHARSETS;

export interface ScrambleOptions {
  /**
   * Total animation time in milliseconds, stagger included. Every character
   * locks in by this time no matter how long the text is.
   * @default 800
   */
  duration?: number;
  /**
   * Milliseconds between successive characters beginning to resolve.
   * Automatically compressed for long strings so `duration` is always honored.
   * @default 20
   */
  stagger?: number;
  /**
   * Order in which characters resolve.
   * @default "start"
   */
  order?: ResolveOrder;
  /**
   * Glyph pool used while characters are scrambling — a preset name
   * (`"upper"`, `"lower"`, `"digits"`, `"alnum"`, `"hex"`, `"binary"`,
   * `"symbols"`, `"blocks"`, `"braille"`, `"katakana"`) or any custom string
   * of characters.
   * @default "alnum"
   */
  charset?: CharsetPreset | (string & {});
  /**
   * Glyph swaps per second while a character is scrambling.
   * @default 30
   */
  glyphRate?: number;
  /**
   * Characters that are never scrambled (whitespace never is, regardless).
   * @default ""
   */
  ignore?: string;
  /**
   * When updating text, also scramble characters that are identical in the
   * old and new strings. Set `false` to only animate what changed.
   * @default true
   */
  scrambleAll?: boolean;
  /**
   * Wave mode: each character keeps its previous glyph until its turn comes,
   * producing a sweep across the text. When `false`, every character starts
   * scrambling immediately and resolves in `order` — the classic decode look.
   * @default false
   */
  sweep?: boolean;
  /**
   * Seed for the glyph randomness. Runs with the same seed, text, and options
   * produce identical frames. Random per run when omitted.
   */
  seed?: number;
  /**
   * Skip the animation entirely (snap to the final text) when the user has
   * `prefers-reduced-motion: reduce` enabled.
   * @default true
   */
  respectReducedMotion?: boolean;
  /** Called when an animation begins. */
  onStart?: () => void;
  /** Called when every character has locked in. */
  onComplete?: () => void;
}

/** Options with defaults applied — what the engine actually runs on. */
export interface ResolvedOptions {
  duration: number;
  stagger: number;
  order: ResolveOrder;
  charsetArr: string[];
  glyphRate: number;
  ignore: string;
  scrambleAll: boolean;
  sweep: boolean;
  seed: number;
  respectReducedMotion: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}
