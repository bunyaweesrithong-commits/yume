import "./effects.js";
// Falling snowflakes on every page.
// Put this file at src/snowflakes.js and add to each page before </body>:
//   <script type="module" src="/src/snowflakes.js"></script>
// (If you added sparkles.js before, remove that line and use this one instead.)

const FLAKES = ["❄", "❅", "❆", "✦", "✧"];
const COUNT = 35;          // how many snowflakes
const COLOR = "#e6dcff";   // snowflake color

const style = document.createElement("style");
style.textContent = `
  .snow-layer { position: fixed; inset: 0; pointer-events: none; z-index: 9999; overflow: hidden; }
  .snow-layer span { position: absolute; top: -5vh; color: ${COLOR};
    text-shadow: 0 0 6px ${COLOR}; user-select: none;
    animation: snow-fall var(--dur) linear var(--delay) infinite,
               snow-sway calc(var(--dur) / 3) ease-in-out var(--delay) infinite alternate; }
  @keyframes snow-fall { to { top: 105vh; } }
  @keyframes snow-sway { from { transform: translateX(-15px) rotate(0deg); }
                         to   { transform: translateX(15px) rotate(180deg); } }
  @media (prefers-reduced-motion: reduce) { .snow-layer span { animation: none; top: var(--still-top); } }
`;
document.head.appendChild(style);

const layer = document.createElement("div");
layer.className = "snow-layer";
layer.setAttribute("aria-hidden", "true");

for (let i = 0; i < COUNT; i++) {
  const f = document.createElement("span");
  f.textContent = FLAKES[Math.floor(Math.random() * FLAKES.length)];
  f.style.left = Math.random() * 100 + "%";
  f.style.setProperty("--still-top", Math.random() * 100 + "vh"); // used when motion is turned off
  f.style.fontSize = 8 + Math.random() * 14 + "px";
  f.style.opacity = 0.4 + Math.random() * 0.5;
  f.style.setProperty("--dur", 8 + Math.random() * 10 + "s");
  f.style.setProperty("--delay", -Math.random() * 18 + "s"); // start mid-fall so the screen isn't empty at first
  layer.appendChild(f);
}

document.body.appendChild(layer);
