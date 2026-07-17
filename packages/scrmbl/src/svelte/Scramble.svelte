<script lang="ts">
  import { ScrambleController } from "../index";
  import type { ScrambleOptions } from "../index";

  type Props = ScrambleOptions & {
    /** Text to display and animate. */
    text: string;
    /** Element to render. @default "span" */
    as?: string;
    /** Scramble the text in on mount. @default true */
    autoStart?: boolean;
    onstart?: () => void;
    oncomplete?: () => void;
  };

  let {
    text,
    as = "span",
    autoStart = true,
    onstart,
    oncomplete,
    ...options
  }: Props = $props();

  let el: HTMLElement;
  const controller = new ScrambleController();

  const fullOptions = () => ({
    ...options,
    onStart: onstart,
    onComplete: oncomplete,
  });

  $effect(() => {
    controller.attach(el, fullOptions());
    if (autoStart) controller.replay();
    return () => controller.destroy();
  });

  $effect(() => {
    const t = text;
    controller.setOptions(fullOptions());
    if (t !== controller.text) controller.update(t);
  });

  /** Re-run the scramble-in animation. */
  export function replay() {
    controller.setOptions(fullOptions()).replay();
  }
</script>

<svelte:element this={as} bind:this={el}>{text}</svelte:element>
