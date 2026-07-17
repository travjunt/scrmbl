"use client";

import { useEffect, useState } from "react";
import { Scramble, useScramble } from "scrmbl/react";
import { Api } from "./api";
import { Charsets } from "./charsets";
import { Examples } from "./examples";
import { Frameworks } from "./frameworks";
import { Install } from "./install";
import { Playground } from "./playground";
import styles from "./home.module.css";

const GITHUB = "https://github.com/travjunt/scrmbl";
const NPM = "https://www.npmjs.com/package/scrmbl";

const PHRASES = ["scrmbl", "decode text.", "resolve glyphs.", "own the reveal."];

function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), 3000);
    return () => clearInterval(id);
  }, []);

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText("pnpm add scrmbl");
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* no-op */
    }
  };

  return (
    <header className={styles.hero}>
      <h1 className={styles.heroTitle}>
        <Scramble order="random" duration={900} stagger={26}>
          {PHRASES[index]}
        </Scramble>
      </h1>
      <p className={styles.heroTag}>
        Scramble/decode text animation for React, Vue, Svelte, and vanilla JS.
      </p>
      <p className={styles.heroMeta}>
        <em>zero dependencies</em> · ~2.8 kB core · grapheme-safe · deterministic seeds · respects
        reduced motion
      </p>
      <button className={styles.installPill} onClick={copy} aria-label="Copy install command">
        <span className={styles.dollar}>$</span>
        <span>pnpm add scrmbl</span>
        <span className={styles.dollar}>{copied ? "✓" : "⧉"}</span>
      </button>
    </header>
  );
}

function Nav() {
  const { ref, replay } = useScramble<HTMLSpanElement>({ charset: "symbols", duration: 500 });
  return (
    <nav className={styles.nav}>
      <span className={styles.wordmark} ref={ref} onMouseEnter={replay}>
        scrmbl
      </span>
      <div className={styles.navLinks}>
        <a href={GITHUB} target="_blank" rel="noreferrer">
          github
        </a>
        <a href={NPM} target="_blank" rel="noreferrer">
          npm
        </a>
      </div>
    </nav>
  );
}

export function Home() {
  return (
    <div className={styles.page}>
      <Nav />
      <Hero />

      <section className={styles.section} id="examples">
        <h2 className={styles.sectionTitle}>four tricks, one component</h2>
        <p className={styles.sectionLede}>
          Hover states, live values, redaction, sequenced reveals — every card is the real
          library running with different options.
        </p>
        <Examples />
      </section>

      <section className={styles.section} id="charsets">
        <h2 className={styles.sectionTitle}>every charset, live</h2>
        <p className={styles.sectionLede}>
          All ten built-in glyph pools, same sentence, so you can compare their texture. Click
          any card to replay it — or pass your own string of characters as{" "}
          <code>charset</code>.
        </p>
        <Charsets />
      </section>

      <section className={styles.section} id="playground">
        <h2 className={styles.sectionTitle}>turn the knobs</h2>
        <p className={styles.sectionLede}>
          Every control maps 1:1 to an option. The snippet underneath is copy-paste ready.
        </p>
        <Playground />
      </section>

      <section className={styles.section} id="install">
        <h2 className={styles.sectionTitle}>install</h2>
        <Install />
      </section>

      <section className={styles.section} id="frameworks">
        <h2 className={styles.sectionTitle}>same trick, four runtimes</h2>
        <p className={styles.sectionLede}>
          The adapters are thin wrappers over one framework-agnostic controller — every option
          works identically everywhere.
        </p>
        <Frameworks />
      </section>

      <section className={styles.section} id="api">
        <h2 className={styles.sectionTitle}>the whole api</h2>
        <p className={styles.sectionLede}>
          These are props in React, Vue, and Svelte, and an options object in vanilla.
        </p>
        <Api />
      </section>

      <footer className={styles.footer}>
        <span>MIT © 2026 Travis McCormick</span>
        <span>
          <a href={GITHUB} target="_blank" rel="noreferrer">
            github
          </a>{" "}
          ·{" "}
          <a href={NPM} target="_blank" rel="noreferrer">
            npm
          </a>{" "}
          ·{" "}
          <a href={`${GITHUB}/issues`} target="_blank" rel="noreferrer">
            issues
          </a>
        </span>
        <span>
          single-page micro-library format with a nod to torph &amp; number-flow — different
          trick, different engine.
        </span>
      </footer>
    </div>
  );
}
