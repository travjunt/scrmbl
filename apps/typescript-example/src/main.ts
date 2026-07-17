import { scramble } from "scrmbl";

const el = document.querySelector<HTMLHeadingElement>("#headline")!;

// Scrambles the existing text in, returns the controller.
const ctrl = scramble(el, { charset: "upper", order: "random", duration: 900 });

const phrases = ["HELLO, VANILLA", "NO FRAMEWORK", "NO DEPENDENCIES", "JUST GLYPHS"];
let i = 0;

document.querySelector("#next")!.addEventListener("click", () => {
  i = (i + 1) % phrases.length;
  ctrl.update(phrases[i]);
});

document.querySelector("#replay")!.addEventListener("click", () => ctrl.replay());
