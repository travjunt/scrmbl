import test from "node:test";
import assert from "node:assert/strict";

// --- 40-line DOM shim: just enough surface for ScrambleController ---------

class FakeElement {
  constructor(tag) {
    this.tagName = tag;
    this.childNodes = [];
    this.attrs = new Map();
    this.style = {};
    this.isConnected = true;
    this._text = "";
  }
  get textContent() {
    return this.childNodes.length
      ? this.childNodes.map((c) => c.textContent).join("")
      : this._text;
  }
  set textContent(v) {
    this.childNodes = [];
    this._text = v;
  }
  appendChild(child) {
    this.childNodes.push(child);
    return child;
  }
  setAttribute(k, v) {
    this.attrs.set(k, String(v));
  }
  getAttribute(k) {
    return this.attrs.has(k) ? this.attrs.get(k) : null;
  }
  hasAttribute(k) {
    return this.attrs.has(k);
  }
  removeAttribute(k) {
    this.attrs.delete(k);
  }
}

globalThis.document = { createElement: (t) => new FakeElement(t) };
globalThis.getComputedStyle = () => ({ whiteSpace: "normal" });
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
// No `window` → prefersReducedMotion() reports false and animations run.

const { ScrambleController } = await import("../dist/index.mjs");

// --- tests ----------------------------------------------------------------

test("controller animates to the target and settles clean", async () => {
  const el = new FakeElement("h1");
  el.textContent = "BOOT";

  const controller = new ScrambleController({ duration: 150, seed: 7 });
  controller.attach(el);
  assert.equal(el.getAttribute("aria-label"), "BOOT");

  let sawCells = false;
  const done = new Promise((resolve) => {
    controller.update("HELLO WORLD", { onComplete: resolve });
  });

  // Mid-flight: per-character cells should exist and be aria-hidden.
  await new Promise((r) => setTimeout(r, 50));
  if (el.childNodes.length > 0) {
    sawCells = true;
    assert.ok(el.childNodes.every((c) => c.getAttribute("aria-hidden") === "true"));
    assert.ok(el.hasAttribute("data-scrmbl-active"));
  }

  await done;
  assert.ok(sawCells, "expected animation frames before settle");
  assert.equal(el.textContent, "HELLO WORLD");
  assert.equal(el.getAttribute("aria-label"), "HELLO WORLD");
  assert.equal(el.hasAttribute("data-scrmbl-active"), false);
  assert.equal(el.childNodes.length, 0, "settles back to plain text");
  assert.equal(controller.animating, false);
});

test("interrupting mid-animation retargets gracefully", async () => {
  const el = new FakeElement("h1");
  el.textContent = "";
  const controller = new ScrambleController({ duration: 200, seed: 3 });
  controller.attach(el);

  controller.update("FIRST TARGET");
  await new Promise((r) => setTimeout(r, 60));
  const done = new Promise((resolve) => {
    controller.update("SECOND", { onComplete: resolve });
  });
  await done;
  assert.equal(el.textContent, "SECOND");
});

test("destroy() during animation cancels without touching the element again", async () => {
  const el = new FakeElement("h1");
  el.textContent = "STAY";
  const controller = new ScrambleController({ duration: 500 });
  controller.attach(el);
  controller.update("NEVER SETTLES");
  await new Promise((r) => setTimeout(r, 40));
  controller.destroy();
  const snapshot = el.textContent;
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(el.textContent, snapshot, "no further mutations after destroy");
});
