# scrmbl

Dependency-free scramble/decode text animation. Characters cycle through random glyphs and resolve into your text.

```sh
pnpm add scrmbl
```

## Quick start

### React — `scrmbl/react`

```tsx
import { Scramble, useScramble } from "scrmbl/react";

// Component: scrambles in on mount, re-scrambles when the text changes.
<Scramble charset="upper" order="random">{title}</Scramble>;

// Hook: attach to any element, trigger whenever you like.
function NavLink({ children }: { children: string }) {
  const { ref, replay } = useScramble<HTMLAnchorElement>({ duration: 450 });
  return <a ref={ref} onMouseEnter={replay}>{children}</a>;
}
```

### Vanilla / TypeScript — `scrmbl`

```ts
import { scramble, ScrambleController } from "scrmbl";

// One-liner: scrambles the element's existing text in.
const ctrl = scramble(document.querySelector("h1")!, { charset: "symbols" });

// Animate to new text; interrupting mid-animation is handled gracefully.
ctrl.update("New headline");
ctrl.replay();  // re-run from nothing
ctrl.finish();  // jump to the end
ctrl.destroy(); // release the element
```

### Vue — `scrmbl/vue`

```vue
<script setup lang="ts">
import { Scramble } from "scrmbl/vue";
</script>

<template>
  <Scramble :text="title" charset="upper" order="random" @complete="onDone" />
</template>
```

### Svelte — `scrmbl/svelte`

```svelte
<script lang="ts">
  import { Scramble } from "scrmbl/svelte";
  let { title } = $props();
</script>

<Scramble text={title} charset="upper" order="random" />
```

Svelte ships as source (`.svelte`), compiled by your bundler — Svelte 5+.

## Options

Every entrypoint accepts the same options (as props in React/Vue/Svelte, as an options object in vanilla).

| Option | Default | Description |
| --- | --- | --- |
| `duration` | `800` | Total animation time in ms. Always honored — stagger compresses for long text, so a 40-character headline and a 400-character paragraph both finish on time. |
| `stagger` | `20` | Delay in ms between successive characters beginning to resolve. |
| `order` | `"start"` | Resolve pattern: `"start"`, `"end"`, `"center"`, `"edges"`, `"random"`. |
| `charset` | `"alnum"` | Glyph pool: a preset name or any custom string of characters. |
| `glyphRate` | `30` | Glyph swaps per second while a character is scrambling. |
| `ignore` | `""` | Characters never scrambled (whitespace never is, regardless). |
| `scrambleAll` | `true` | Set `false` to only animate characters that changed between updates — great for live values like prices and counters. |
| `sweep` | `false` | Wave mode: each character keeps its old glyph until its turn, producing a sweep. Default is the classic everything-scrambles-then-resolves decode. |
| `seed` | random | Deterministic runs: the same seed + text + options produce identical frames. |
| `respectReducedMotion` | `true` | Snap instantly to the final text when the user prefers reduced motion. |
| `onStart` / `onComplete` | — | Lifecycle callbacks (events `start`/`complete` in Vue, `onstart`/`oncomplete` props in Svelte). |

### Charset presets

`upper` · `lower` · `digits` · `alnum` · `hex` · `binary` · `symbols` · `blocks` (`░▒▓█…`) · `braille` (`⠿⡿⣷…`) · `katakana`

```ts
import { CHARSETS } from "scrmbl";
```

Any string works too: `charset: "01│─┌┐"`.

## Styling

While animating, the library sets data attributes you can hook with CSS:

```css
/* the element */
[data-scrmbl-active] { /* animation in flight */ }

/* per-character spans; [data-glyph] = currently showing a random glyph */
[data-scrmbl-cell][data-glyph] {
  color: var(--accent);
  opacity: 0.55;
}
```

After the animation settles, the element flattens back to plain text — copy/paste, SEO, and line wrapping behave exactly as if scrmbl was never there.

## Accessibility

- The element's `aria-label` always carries the real text; per-character spans are `aria-hidden`, so screen readers never hear glyph soup.
- `prefers-reduced-motion: reduce` skips the animation entirely (disable via `respectReducedMotion: false` if you must).

## SSR

Server rendering outputs the final text — no hydration mismatch, no flash of empty content. The scramble-in runs client-side on mount (`autoStart={false}` opts out in the component adapters).

## Notes

- **Fonts:** with proportional fonts, widths jitter slightly while glyphs cycle. Monospace fonts, `font-variant-numeric: tabular-nums` (for digits), or width-stable charsets (`blocks`, `braille`) give the steadiest look.
- **Graphemes:** text is segmented with `Intl.Segmenter` where available, so emoji (including ZWJ sequences) scramble as single units.
- **Engine:** each frame is a pure function of time — `frameAt(plan, t)` — which is what makes seeded runs perfectly reproducible. The pure pieces (`computePlan`, `frameAt`, `segment`, `CHARSETS`) are exported if you want to build your own renderer.

## License

MIT © Travis McCormick
