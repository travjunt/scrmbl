<script setup lang="ts">
import { ref } from "vue";
import { Scramble } from "scrmbl/vue";

const phrases = ["HELLO, VUE", "PROPS IN", "GLYPHS OUT"];
const i = ref(0);
const next = () => {
  i.value = (i.value + 1) % phrases.length;
};
</script>

<template>
  <main style="text-align: center">
    <h1 style="font-size: 42px; letter-spacing: -0.02em">
      <Scramble :text="phrases[i]" charset="upper" order="random" />
    </h1>
    <button
      style="
        font: inherit;
        color: #51f0a8;
        background: none;
        border: 1px solid #1d2124;
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
      "
      @click="next"
    >
      next phrase
    </button>
  </main>
</template>
