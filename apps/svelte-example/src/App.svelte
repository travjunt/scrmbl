<script lang="ts">
  import { Scramble } from "scrmbl/svelte";

  const phrases = ["HELLO, SVELTE", "RUNES READY", "SHIPS AS SOURCE"];
  let i = $state(0);
</script>

<main style="text-align: center">
  <h1 style="font-size: 42px; letter-spacing: -0.02em">
    <Scramble text={phrases[i]} charset="upper" order="random" />
  </h1>
  <button
    style="font: inherit; color: #51f0a8; background: none; border: 1px solid #1d2124; border-radius: 8px; padding: 8px 16px; cursor: pointer;"
    onclick={() => (i = (i + 1) % phrases.length)}
  >
    next phrase
  </button>
</main>
