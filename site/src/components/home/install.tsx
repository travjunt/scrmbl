"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";
import styles from "./home.module.css";

const MANAGERS = [
  { name: "pnpm", cmd: "pnpm add scrmbl" },
  { name: "npm", cmd: "npm install scrmbl" },
  { name: "yarn", cmd: "yarn add scrmbl" },
  { name: "bun", cmd: "bun add scrmbl" },
];

export function Install() {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Package manager">
        {MANAGERS.map((m, i) => (
          <button
            key={m.name}
            className={styles.tab}
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            {m.name}
          </button>
        ))}
      </div>
      <CodeBlock code={MANAGERS[index].cmd} />
    </div>
  );
}
