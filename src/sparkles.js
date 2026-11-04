// Twinkling sparkle background for every page.
// Put this file at src/sparkles.js and add to each page before </body>:
//   <script type="module" src="/src/sparkles.js"></script>

const SYMBOLS = ["✦", "✧", "⋆", "˚", "✩", "⊹"];
const COUNT = 28;

const style = document.createElement("style");
style.textContent = `
  .sparkle-layer { position: fixed; inset: 0; pointer-events: none; z-index: -1; overflow: hidden; }
  .sparkle-layer span { position: absolute; color: #c4a8ff; opacity: 0;
    animation: sparkle-twinkle var(--dur) ease-in-out var(--delay) infinite; }
  @keyframes sparkle-twinkle {
    0%, 100% { opacity: 0; transform: scale(.6) rotate(0deg); }
    50% { opacity: .9; transform: scale(1.15) rotate(20deg); text-shadow: 0 0 8px #c4a8ff; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sparkle-layer span { animation: none; opacity: .4; }
  }
`;
document.head.appendChild(style);

const layer = document.createElement("div");
layer.className = "sparkle-layer";
layer.setAttribute("aria-hidden", "true");

for (let i = 0; i < COUNT; i++) {
  const s = document.createElement("span");
  s.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.fontSize = 8 + Math.random() * 14 + "px";
  s.style.setProperty("--dur", 2 + Math.random() * 3 + "s");
  s.style.setProperty("--delay", Math.random() * 4 + "s");
  layer.appendChild(s);
}

document.body.prepend(layer);
