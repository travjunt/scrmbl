"use client";

import styles from "./home.module.css";

const ROWS: [string, string, string][] = [
  ["duration", "800", "Total animation time (ms). Always honored — stagger compresses for long text."],
  ["stagger", "20", "Delay (ms) between successive characters starting to resolve."],
  ["order", '"start"', "Resolve pattern: start · end · center · edges · random."],
  ["charset", '"alnum"', "Glyph pool: a preset name or any custom string of characters."],
  ["glyphRate", "30", "Glyph swaps per second while a character is scrambling."],
  ["ignore", '""', "Characters never scrambled (whitespace never is, regardless)."],
  ["scrambleAll", "true", "false = only animate characters that changed between updates."],
  ["sweep", "false", "Wave mode: characters hold their old glyph until their turn."],
  ["seed", "—", "Deterministic runs: same seed + text + options → identical frames."],
  ["respectReducedMotion", "true", "Snap instantly when the user prefers reduced motion."],
  ["onStart / onComplete", "—", "Animation lifecycle callbacks."],
];

export function Api() {
  return (
    <table className={styles.apiTable}>
      <thead>
        <tr>
          <th>option</th>
          <th>default</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map(([name, def, desc]) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{def}</td>
            <td>{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
