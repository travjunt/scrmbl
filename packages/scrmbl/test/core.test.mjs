import test from "node:test";
import assert from "node:assert/strict";
import {
  CHARSETS,
  computePlan,
  frameAt,
  resolveCharset,
  segment,
} from "../dist/index.mjs";

/** Build ResolvedOptions with defaults for tests. */
function opts(overrides = {}) {
  return {
    duration: 800,
    stagger: 20,
    order: "start",
    charsetArr: resolveCharset("alnum"),
    glyphRate: 30,
    ignore: "",
    scrambleAll: true,
    sweep: false,
    seed: 1234,
    respectReducedMotion: true,
    ...overrides,
  };
}

test("resolves exactly to the target text at t >= total", () => {
  const plan = computePlan(segment("old text"), segment("NEW TEXT!"), opts());
  assert.equal(frameAt(plan, plan.total).join(""), "NEW TEXT!");
  assert.equal(frameAt(plan, plan.total + 5000).join(""), "NEW TEXT!");
});

test("same seed replays identical frames; different seeds differ", () => {
  const o = opts({ seed: 42 });
  const a = computePlan([], segment("determinism"), o);
  const b = computePlan([], segment("determinism"), o);
  for (const t of [0, 50, 133, 400, 799]) {
    assert.deepEqual(frameAt(a, t), frameAt(b, t));
  }
  const c = computePlan([], segment("determinism"), opts({ seed: 43 }));
  const differs = [0, 50, 133, 400].some(
    (t) => frameAt(a, t).join("") !== frameAt(c, t).join("")
  );
  assert.ok(differs, "different seeds should produce different glyphs");
});

test("whitespace is never scrambled", () => {
  const plan = computePlan([], segment("a b\tc"), opts());
  for (let t = 0; t <= plan.total; t += 16) {
    const frame = frameAt(plan, t);
    assert.equal(frame[1], " ");
    assert.equal(frame[3], "\t");
  }
});

test("ignore list keeps characters static", () => {
  const plan = computePlan([], segment("$1,000"), opts({ ignore: "$," }));
  for (let t = 0; t <= plan.total; t += 16) {
    const frame = frameAt(plan, t);
    assert.equal(frame[0], "$");
    assert.equal(frame[2], ",");
  }
});

test("scrambleAll: false leaves unchanged characters alone", () => {
  const plan = computePlan(segment("cat"), segment("car"), opts({ scrambleAll: false }));
  for (let t = 0; t <= plan.total; t += 16) {
    const frame = frameAt(plan, t);
    assert.equal(frame[0], "c");
    assert.equal(frame[1], "a");
  }
  assert.equal(frameAt(plan, plan.total).join(""), "car");
});

test("total duration is honored regardless of text length", () => {
  const short = computePlan([], segment("hi"), opts({ duration: 500 }));
  const long = computePlan([], segment("x".repeat(400)), opts({ duration: 500 }));
  assert.ok(short.total <= 500 + 1e-6);
  assert.ok(long.total <= 500 + 1e-6, `long.total was ${long.total}`);
  for (const cell of long.cells) {
    assert.ok(cell.lock <= long.total + 1e-6);
  }
});

test('order "start" locks earlier cells first; "end" reverses', () => {
  const fwd = computePlan([], segment("abcdef"), opts({ order: "start" }));
  assert.ok(fwd.cells[0].lock < fwd.cells[5].lock);
  const rev = computePlan([], segment("abcdef"), opts({ order: "end" }));
  assert.ok(rev.cells[0].lock > rev.cells[5].lock);
});

test("scrambling glyphs are drawn from the configured charset", () => {
  const charsetArr = resolveCharset("binary");
  const plan = computePlan([], segment("HELLO"), opts({ charset: "binary", charsetArr }));
  const frame = frameAt(plan, 10);
  for (const g of frame) {
    assert.ok(g === "0" || g === "1", `unexpected glyph "${g}"`);
  }
});

test("graphemes survive: emoji are single cells", () => {
  const graphemes = segment("a👩‍👩‍👧‍👦b");
  assert.equal(graphemes.length, 3);
  const plan = computePlan([], graphemes, opts());
  assert.equal(frameAt(plan, plan.total).join(""), "a👩‍👩‍👧‍👦b");
});

test("shrinking text scrambles extra cells out to empty", () => {
  const plan = computePlan(segment("longer text"), segment("short"), opts());
  const end = frameAt(plan, plan.total);
  assert.equal(end.join(""), "short");
  assert.equal(end.length, "longer text".length);
});

test("charset presets resolve; custom strings pass through", () => {
  assert.ok(resolveCharset("hex").includes("F"));
  assert.deepEqual(resolveCharset("абв"), ["а", "б", "в"]);
  assert.ok(Object.keys(CHARSETS).length >= 10);
});
