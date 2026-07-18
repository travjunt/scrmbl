import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "scrmbl — dependency-free decode-text animation",
  description:
    "Scramble/decode text animation for React, Vue, Svelte, and vanilla JS. Dependency-free, grapheme-safe, deterministic under a seed, reduced-motion friendly.",
  keywords: ["scramble", "decode", "text animation", "react", "vue", "svelte"],
};

export const viewport: Viewport = {
  themeColor: "#08090a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
