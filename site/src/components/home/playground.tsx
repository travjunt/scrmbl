"use client";

import { useEffect, useState } from "react";
import { CHARSETS, type ResolveOrder } from "scrmbl";
import { useScramble } from "scrmbl/react";
import { CodeBlock } from "./code-block";
import styles from "./home.module.css";

const ORDERS: ResolveOrder[] = ["start", "end", "center", "edges", "random"];
const PRESETS = Object.keys(CHARSETS);

export function Playground() {
  const [text, setText] = useState("THE FUTURE IS UNWRITTEN");
  const [order, setOrder] = useState<ResolveOrder>("start");
  const [charset, setCharset] = useState("alnum");
  const [sweep, setSweep] = useState(false);
  const [duration, setDuration] = useState(800);
  const [stagger, setStagger] = useState(20);

  const { ref, update, replay } = useScramble<HTMLHeadingElement>({
    order,
    charset,
    sweep,
    duration,
    stagger,
  });

  // Re-run whenever a knob changes (text edits animate via `update` below).
  useEffect(() => {
    replay();
  }, [order, charset, sweep, duration, stagger, replay]);

  const snippet = `<Scramble
  order="${order}"
  charset="${charset}"${sweep ? "\n  sweep" : ""}
  duration={${duration}}
  stagger={${stagger}}
>
  {text}
</Scramble>`;

  return (
    <div>
      <div className={styles.playground}>
        <div className={styles.pgPreview}>
          <h2 className={styles.pgText} ref={ref}>
            {text}
          </h2>
        </div>
        <div className={styles.pgControls}>
          <label className={styles.pgField}>
            text
            <input
              type="text"
              value={text}
              maxLength={64}
              onChange={(e) => {
                setText(e.target.value);
                update(e.target.value);
              }}
            />
          </label>
          <label className={styles.pgField}>
            order
            <select value={order} onChange={(e) => setOrder(e.target.value as ResolveOrder)}>
              {ORDERS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className={styles.pgField}>
            charset
            <select value={charset} onChange={(e) => setCharset(e.target.value)}>
              {PRESETS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className={styles.pgField}>
            duration {duration}ms
            <input
              type="range"
              min={200}
              max={3000}
              step={50}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </label>
          <label className={styles.pgField}>
            stagger {stagger}ms
            <input
              type="range"
              min={0}
              max={80}
              step={2}
              value={stagger}
              onChange={(e) => setStagger(Number(e.target.value))}
            />
          </label>
          <label className={`${styles.pgField} ${styles.checkbox}`}>
            <input type="checkbox" checked={sweep} onChange={(e) => setSweep(e.target.checked)} />
            sweep
          </label>
          <button className={styles.runBtn} onClick={replay}>
            run
          </button>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <CodeBlock code={snippet} />
      </div>
    </div>
  );
}
