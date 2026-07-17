import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"] as ("esm" | "cjs")[],
  dts: true,
  sourcemap: true,
  target: "es2020" as const,
  external: ["react", "vue", "svelte"],
};

export default defineConfig([
  {
    ...shared,
    clean: true,
    entry: {
      index: "src/index.ts",
      "vue/index": "src/vue/index.ts",
    },
  },
  {
    ...shared,
    clean: false,
    entry: {
      "react/index": "src/react/index.ts",
    },
    banner: { js: '"use client";' },
  },
]);
