"use client";

import { useEffect, useRef } from "react";
import { CHARSETS } from "scrmbl";
import { useScramble } from "scrmbl/react";
import styles from "./home.module.css";

const SAMPLE = "THE QUICK FOX 0123";
const CYCLE_MS = 4600;
const PHASE_MS = 340;

function CharsetCard({ name, index }: { name: string; index: number }) {
  const { ref, replay } = useScramble<HTMLDivElement>({
    charset: name,
    order: "random",
    duration: 800,
  });
  const cardRef = useRef<HTMLButtonElement | null>(null);

  // Animate only while on screen, phase-shifted so the grid ripples
  // instead of firing all ten at once.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeout = setTimeout(() => {
            replay();
            interval = setInterval(replay, CYCLE_MS);
          }, index * PHASE_MS);
        } else {
          clearTimeout(timeout);
          clearInterval(interval);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      io.disconnect();
    };
  }, [replay, index]);

  const glyphs = (CHARSETS as Record<string, string>)[name];

  return (
    <button
      ref={cardRef}
      className={styles.charsetCard}
      onClick={replay}
      aria-label={`Replay the ${name} charset preview`}
    >
      <span className={styles.charsetHead}>
        <span className={styles.charsetName}>{name}</span>
        <span className={styles.charsetGlyphs} aria-hidden="true">
          {Array.from(glyphs).slice(0, 12).join("")}
        </span>
      </span>
      <div className={styles.charsetSample} ref={ref}>
        {SAMPLE}
      </div>
    </button>
  );
}

export function Charsets() {
  return (
    <div className={styles.charsetGrid}>
      {Object.keys(CHARSETS).map((name, i) => (
        <CharsetCard key={name} name={name} index={i} />
      ))}
    </div>
  );
}
