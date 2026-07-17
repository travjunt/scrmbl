# scrmbl

Dependency-free scramble/decode text animation for React, Vue, Svelte, and vanilla JS.

Characters cycle through random glyphs and resolve into your text — the classic "decrypt" effect, packaged as a tiny framework-agnostic engine with thin adapters.

- **Zero dependencies.** ~2.8 kB min+gzip core, no runtime baggage.
- **Four entrypoints.** `scrmbl` (vanilla/TS), `scrmbl/react`, `scrmbl/vue`, `scrmbl/svelte`.
- **Duration you can trust.** Stagger auto-compresses for long strings; every animation finishes exactly on time.
- **Grapheme-safe.** Emoji and combining marks animate as single characters via `Intl.Segmenter`.
- **Deterministic when you want it.** Pass a `seed` and every run replays the identical glyph sequence.
- **Accessible by default.** `aria-label` holds the real text, glyph spans are `aria-hidden`, and `prefers-reduced-motion` snaps instantly.

## Install

```sh
pnpm add scrmbl
```

## Usage

```tsx
import { Scramble } from "scrmbl/react";

<Scramble charset="upper" order="random">Hello world</Scramble>;
```

```ts
import { scramble } from "scrmbl";

const ctrl = scramble(document.querySelector("h1")!);
ctrl.update("New headline");
```

See the [package README](packages/scrmbl/README.md) for the full API — options, charset presets, hooks, styling, SSR notes.

## Repo layout

| Path | What |
| --- | --- |
| `packages/scrmbl` | The published library |
| `site` | Demo/docs site (Next.js, static export) |
| `apps/*` | Minimal example apps per framework |

## Contributing

```sh
pnpm install       # install everything
pnpm dev           # watch the lib + run the site
pnpm build         # build the library
pnpm test          # build + run core engine tests
pnpm example:react # or :vue, :svelte, :typescript
```

Releases use [changesets](https://github.com/changesets/changesets): `pnpm changeset` with your PR, and CI handles versioning + publish.

## Acknowledgements

The single-page micro-library format (live examples → install → usage per framework) is a pattern popularized by projects like [torph](https://github.com/lochie/torph) and [number-flow](https://number-flow.barvian.me/). scrmbl shares the format, not the code — different effect, different engine, written from scratch.

## License

MIT © Travis McCormick
