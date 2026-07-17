"use client";

import type { ReactNode } from "react";
import { CodeBlock } from "./code-block";
import { ReactLogo, SvelteLogo, TypeScriptLogo, VueLogo } from "./logos";
import styles from "./home.module.css";

interface Framework {
  name: string;
  entry: string;
  logo: ReactNode;
  code: string;
}

const FRAMEWORKS: Framework[] = [
  {
    name: "React",
    entry: "scrmbl/react",
    logo: <ReactLogo />,
    code: `import { Scramble, useScramble } from "scrmbl/react";

// Component: animates on mount and on change
<Scramble charset="upper" order="random">
  {title}
</Scramble>

// Hook: full control
const { ref, replay } = useScramble({ charset: "hex" });
<h1 ref={ref} onMouseEnter={replay}>C0FFEE</h1>`,
  },
  {
    name: "TypeScript",
    entry: "scrmbl",
    logo: <TypeScriptLogo />,
    code: `import { scramble } from "scrmbl";

// Scramble in whatever the element says
const ctrl = scramble(
  document.querySelector("h1")!,
  { charset: "symbols" }
);

// Animate to new text whenever
ctrl.update("New headline");`,
  },
  {
    name: "Vue",
    entry: "scrmbl/vue",
    logo: <VueLogo />,
    code: `<script setup lang="ts">
import { Scramble } from "scrmbl/vue";
</script>

<template>
  <Scramble
    :text="title"
    charset="upper"
    order="random"
  />
</template>`,
  },
  {
    name: "Svelte",
    entry: "scrmbl/svelte",
    logo: <SvelteLogo />,
    code: `<script lang="ts">
  import { Scramble } from "scrmbl/svelte";
  let { title } = $props();
</script>

<Scramble
  text={title}
  charset="upper"
  order="random"
/>`,
  },
];

export function Frameworks() {
  return (
    <div className={styles.fwGrid}>
      {FRAMEWORKS.map((f) => (
        <div key={f.name}>
          <div className={styles.fwHead}>
            <span className={styles.fwLogo}>{f.logo}</span>
            <span className={styles.fwName}>{f.name}</span>
            <code className={styles.fwEntry}>{f.entry}</code>
          </div>
          <CodeBlock code={f.code} />
        </div>
      ))}
    </div>
  );
}
