"use client";

import { useEffect, useRef, useState } from "react";
import { Scramble, useScramble } from "scrmbl/react";
import styles from "./home.module.css";

function HoverLink({ children }: { children: string }) {
  const { ref, replay } = useScramble<HTMLAnchorElement>({
    charset: "upper",
    duration: 450,
    stagger: 14,
  });
  return (
    <a ref={ref} href="#examples" onMouseEnter={replay} onFocus={replay}>
      {children}
    </a>
  );
}

function HoverNavCard() {
  return (
    <div className={`${styles.card} ${styles.span3}`}>
      <div className={styles.cardLabel}>
        <span>hover states</span>
        <span>charset=&quot;upper&quot;</span>
      </div>
      <div className={styles.cardBody}>
        <nav className={styles.fakeNav} aria-label="Demo navigation">
          <HoverLink>ABOUT</HoverLink>
          <HoverLink>PROJECTS</HoverLink>
          <HoverLink>CONTACT</HoverLink>
        </nav>
      </div>
    </div>
  );
}

function LiveStatCard() {
  const [price, setPrice] = useState(64_213.4);
  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => Math.max(1000, p + (Math.random() - 0.48) * 900));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const formatted = `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div className={`${styles.card} ${styles.span3}`}>
      <div className={styles.cardLabel}>
        <span>live values</span>
        <span>scrambleAll={"{false}"}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.statValue}>
          <Scramble charset="digits" scrambleAll={false} ignore="$,." duration={500} autoStart={false}>
            {formatted}
          </Scramble>
        </div>
        <div className={styles.statLabel}>
          FAKE/USD · <span className={styles.statUp}>only changed digits animate</span>
        </div>
      </div>
    </div>
  );
}

function RedactedCard() {
  const [revealed, setRevealed] = useState(false);
  const text = revealed ? "4242-TRVS-8815-SCRM" : "████-████-████-████";
  return (
    <div className={`${styles.card} ${styles.span2}`}>
      <div className={styles.cardLabel}>
        <span>redacted</span>
        <span>charset=&quot;blocks&quot;</span>
      </div>
      <div className={styles.cardBody}>
        <button
          className={styles.redacted}
          onClick={() => setRevealed((r) => !r)}
          aria-pressed={revealed}
        >
          <Scramble charset="blocks" order="random" duration={700} autoStart={false}>
            {text}
          </Scramble>
        </button>
        <div className={styles.redactedHint}>click to {revealed ? "redact" : "decrypt"}</div>
      </div>
    </div>
  );
}

const BOOT_LINES = [
  { text: "boot: scrmbl v0.1.0", ok: false },
  { text: "loading charsets .......... ok", ok: true },
  { text: "seeding glyph stream ...... ok", ok: true },
  { text: "decode complete in 0.8s", ok: false },
];

function TerminalCard() {
  const [visible, setVisible] = useState(1);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = (from: number) => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setVisible(from);
    for (let i = from + 1; i <= BOOT_LINES.length; i++) {
      timeouts.current.push(setTimeout(() => setVisible(i), (i - from) * 550));
    }
  };

  useEffect(() => {
    run(1);
    const saved = timeouts.current;
    return () => saved.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${styles.card} ${styles.span4}`}>
      <div className={styles.cardLabel}>
        <span>sequenced</span>
        <button className={styles.replayBtn} onClick={() => run(0)}>
          replay
        </button>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.terminal}>
          {BOOT_LINES.slice(0, visible).map((line) => (
            <div key={line.text} className={line.ok ? styles.ok : undefined}>
              <span className={styles.termPrompt}>&gt; </span>
              <Scramble charset="katakana" sweep duration={520} stagger={12}>
                {line.text}
              </Scramble>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Examples() {
  return (
    <div className={styles.grid}>
      <HoverNavCard />
      <LiveStatCard />
      <RedactedCard />
      <TerminalCard />
    </div>
  );
}
