/**
 * Split a string into user-perceived characters (graphemes) so emoji,
 * combining marks, and family sequences animate as single units instead of
 * shattering into surrogate halves.
 */
export function segment(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  // Fallback: code points (still avoids splitting surrogate pairs).
  return Array.from(text);
}

export function isWhitespace(grapheme: string): boolean {
  return grapheme.length > 0 && grapheme.trim() === "";
}
