/**
 * Svelte ships as source (.svelte) so the consumer's compiler owns the
 * output. tsup handles the TS entries; this script assembles dist/svelte.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(pkgRoot, "dist", "svelte");

await mkdir(outDir, { recursive: true });

// 1. Copy the component, pointing its core import at the built ESM bundle.
const component = await readFile(join(pkgRoot, "src", "svelte", "Scramble.svelte"), "utf8");
await writeFile(
  join(outDir, "Scramble.svelte"),
  component.replaceAll('from "../index"', 'from "../index.mjs"')
);

// 2. Entry module.
await writeFile(
  join(outDir, "index.mjs"),
  `export { default as Scramble } from "./Scramble.svelte";
export { ScrambleController, CHARSETS, scramble } from "../index.mjs";
`
);

// 3. Hand-rolled types (no svelte compiler needed at build time).
await writeFile(
  join(outDir, "index.d.ts"),
  `import type { Component } from "svelte";
import type { ScrambleOptions } from "../index";

export type ScrambleProps = ScrambleOptions & {
  /** Text to display and animate. */
  text: string;
  /** Element to render. @default "span" */
  as?: string;
  /** Scramble the text in on mount. @default true */
  autoStart?: boolean;
  onstart?: () => void;
  oncomplete?: () => void;
};

export declare const Scramble: Component<ScrambleProps, { replay: () => void }>;
export { ScrambleController, CHARSETS, scramble } from "../index";
export type { ScrambleOptions, ResolveOrder, CharsetPreset } from "../index";
`
);

console.log("svelte: dist/svelte assembled");
