"use client";

import { useState } from "react";
import styles from "./home.module.css";

type TokenType = "comment" | "string" | "keyword" | "tag" | "attr" | "number" | "plain";

const TOKEN_RX =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|const|let|var|function|return|new|type|interface|await|async|default)\b|(<\/?[A-Za-z][\w.]*|\/>)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$-]*(?==))/g;

const CLASS: Record<TokenType, string | undefined> = {
  comment: styles.tComment,
  string: styles.tString,
  keyword: styles.tKeyword,
  tag: styles.tTag,
  attr: styles.tAttr,
  number: styles.tNumber,
  plain: undefined,
};

/** Tiny purpose-built highlighter — good enough for our handful of snippets. */
function tokenize(code: string): { text: string; type: TokenType }[] {
  const tokens: { text: string; type: TokenType }[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN_RX)) {
    const i = m.index ?? 0;
    if (i > last) tokens.push({ text: code.slice(last, i), type: "plain" });
    const type: TokenType = m[1]
      ? "comment"
      : m[2]
        ? "string"
        : m[3]
          ? "keyword"
          : m[4]
            ? "tag"
            : m[5]
              ? "number"
              : "attr";
    tokens.push({ text: m[0], type });
    last = i + m[0].length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), type: "plain" });
  return tokens;
}

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className={styles.codeBlock}>
      <button className={styles.copyBtn} onClick={copy} aria-label="Copy code">
        {copied ? "copied" : "copy"}
      </button>
      <pre>
        <code>
          {tokenize(code).map((t, i) =>
            t.type === "plain" ? (
              t.text
            ) : (
              <span key={i} className={CLASS[t.type]}>
                {t.text}
              </span>
            )
          )}
        </code>
      </pre>
    </div>
  );
}
