import * as React from "react";
import { ScrambleController } from "../lib/controller";
import type { ScrambleOptions } from "../lib/types";

export type ScrambleProps = ScrambleOptions & {
  /** Text content. Strings/numbers only — scrambling operates on characters. */
  children: React.ReactNode;
  /** Element to render. @default "span" */
  as?: React.ElementType;
  /** Scramble the text in on mount. @default true */
  autoStart?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function toText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (node == null || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(toText).join("");
  throw new Error(
    "<Scramble> can only animate text. Pass strings, numbers, or expressions — not elements."
  );
}

const OPTION_KEYS = [
  "duration",
  "stagger",
  "order",
  "charset",
  "glyphRate",
  "ignore",
  "scrambleAll",
  "sweep",
  "seed",
  "respectReducedMotion",
] as const;

function pickOptions(props: ScrambleOptions): ScrambleOptions {
  const out: Record<string, unknown> = {};
  for (const key of OPTION_KEYS) {
    if (props[key] !== undefined) out[key] = props[key];
  }
  if (props.onStart) out.onStart = props.onStart;
  if (props.onComplete) out.onComplete = props.onComplete;
  return out as ScrambleOptions;
}

/**
 * Headless-ish hook when you want full control:
 *
 * ```tsx
 * const { ref, replay } = useScramble({ charset: "hex" });
 * return <h1 ref={ref} onMouseEnter={replay}>DEADBEEF</h1>;
 * ```
 */
export function useScramble<T extends HTMLElement = HTMLElement>(
  options: ScrambleOptions = {}
) {
  const ref = React.useRef<T | null>(null);
  const controllerRef = React.useRef<ScrambleController | null>(null);
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const getController = React.useCallback(() => {
    if (!controllerRef.current) controllerRef.current = new ScrambleController();
    return controllerRef.current;
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = getController();
    controller.attach(el, optionsRef.current);
    return () => controller.destroy();
  }, [getController]);

  const update = React.useCallback(
    (text: string) => getController().setOptions(optionsRef.current).update(text),
    [getController]
  );
  const replay = React.useCallback(
    () => getController().setOptions(optionsRef.current).replay(),
    [getController]
  );

  return { ref, update, replay, controller: getController() };
}

/**
 * Drop-in component: renders its text (SSR-safe), scrambles in on mount,
 * and re-scrambles whenever the text changes.
 *
 * ```tsx
 * <Scramble charset="upper" order="random">{title}</Scramble>
 * ```
 */
export const Scramble = ({
  children,
  as: Component = "span",
  autoStart = true,
  className,
  style,
  ...rest
}: ScrambleProps) => {
  const text = toText(children);
  const options = pickOptions(rest);

  const ref = React.useRef<HTMLElement | null>(null);
  const controllerRef = React.useRef<ScrambleController | null>(null);
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = new ScrambleController();
    controllerRef.current = controller;
    controller.attach(el, optionsRef.current);
    if (autoStart) controller.replay();
    return () => controller.destroy();
    // Mount-only: autoStart changing after mount shouldn't re-run the intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    controller.setOptions(optionsRef.current);
    if (text !== controller.text) controller.update(text);
  }, [text]);

  return (
    <Component ref={ref} className={className} style={style}>
      {text}
    </Component>
  );
};
