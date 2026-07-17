/** Built-in glyph pools. Pass any custom string to use your own. */
export const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  alnum: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  hex: "0123456789ABCDEF",
  binary: "01",
  symbols: "#$%&*+<=>?@^~-_/\\|",
  blocks: "░▒▓█▖▗▘▚▛▜▝▞▟",
  braille: "⠁⠅⠇⠏⠗⠟⠧⠯⠷⠿⡿⢿⣻⣽⣾⣷⣯⣟⣿",
  katakana:
    "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロン",
} as const;

/**
 * Resolve a charset option (preset name or custom string) to an array of
 * glyphs. Uses `Array.from` so astral code points survive.
 */
export function resolveCharset(charset: string | undefined): string[] {
  if (!charset) return Array.from(CHARSETS.alnum);
  const preset = (CHARSETS as Record<string, string>)[charset];
  return Array.from(preset ?? charset);
}
