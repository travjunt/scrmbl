import { useEffect, useState } from "react";
import { Scramble, useScramble } from "scrmbl/react";

const PHRASES = ["HELLO, REACT", "COMPONENT OR HOOK", "YOUR CALL"];

export function App() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % PHRASES.length), 2600);
    return () => clearInterval(id);
  }, []);

  const { ref, replay } = useScramble<HTMLParagraphElement>({ charset: "hex", duration: 600 });

  return (
    <main style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: 42, letterSpacing: "-0.02em" }}>
        <Scramble order="random" charset="upper">
          {PHRASES[i]}
        </Scramble>
      </h1>
      <p ref={ref} onMouseEnter={replay} style={{ color: "#9aa1a9", cursor: "default" }}>
        hover me — useScramble()
      </p>
    </main>
  );
}
