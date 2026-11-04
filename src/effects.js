// Extra decorations for every page (loaded from snowflakes.js, so no HTML changes needed):
//  1. Cards lift up and glow purple on hover
//  2. Twinkling sparkle trail that follows the mouse
//  3. Sakura petals and butterflies drifting across the screen
//  4. Character images slowly float up and down

const GLOW = "rgba(167, 139, 250, 0.45)";
const CARD_SELECTORS = ".about-card, .about-intro-card, .home-card, .game-item";
const FLOAT_SELECTORS = ".yume-pair-image img, .oc-entry-image img, .yume-pair-img, .favorite-chars__figure img";
const PETALS = ["🌸", "🌸", "🌸", "🦋"]; // more petals than butterflies
const PETAL_COUNT = 8;

const style = document.createElement("style");
style.textContent = `
  /* 1. Card hover */
  ${CARD_SELECTORS} {
    transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
  }
  ${CARD_SELECTORS.split(",").map((s) => s.trim() + ":hover").join(", ")} {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px ${GLOW}, 0 0 18px ${GLOW};
    border-color: rgba(196, 168, 255, 0.6);
  }

  /* 2. Mouse sparkle trail */
  .fx-trail { position: fixed; pointer-events: none; z-index: 10000;
    color: #f0d9ff; text-shadow: 0 0 8px #c4a8ff; user-select: none;
    animation: fx-trail-fade .9s ease-out forwards; }
  @keyframes fx-trail-fade {
    0%   { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
    100% { opacity: 0; transform: translate(-50%, calc(-50% + 18px)) scale(.3) rotate(90deg); }
  }

  /* 3. Drifting petals and butterflies */
  .fx-petal-layer { position: fixed; inset: 0; pointer-events: none; z-index: 9998; overflow: hidden; }
  .fx-petal { position: absolute; left: -10vw; user-select: none; opacity: .85;
    animation: fx-drift var(--dur) linear var(--delay) infinite; }
  .fx-petal span { display: inline-block; animation: fx-spin var(--spin) ease-in-out infinite alternate; }
  @keyframes fx-drift {
    0%   { transform: translate(0, 0); }
    50%  { transform: translate(60vw, var(--dip)); }
    100% { transform: translate(120vw, var(--fall)); }
  }
  @keyframes fx-spin { from { transform: rotate(-25deg); } to { transform: rotate(25deg) scale(.9); } }

  /* 4. Floating character images */
  ${FLOAT_SELECTORS} { animation: fx-float 4s ease-in-out infinite; }
  @keyframes fx-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }
`;
document.head.appendChild(style);

// Give floating images slightly different timings so they don't move in sync
document.querySelectorAll(FLOAT_SELECTORS).forEach((img, i) => {
  img.style.animationDelay = -(i * 0.7) + "s";
});

// 2. Sparkle trail (mouse only, throttled)
const TRAIL = ["✦", "✧", "⋆", "˚"];
let lastTrail = 0;
window.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  const now = performance.now();
  if (now - lastTrail < 40) return;
  lastTrail = now;
  const s = document.createElement("span");
  s.className = "fx-trail";
  s.textContent = TRAIL[Math.floor(Math.random() * TRAIL.length)];
  s.style.left = e.clientX + (Math.random() * 12 - 6) + "px";
  s.style.top = e.clientY + (Math.random() * 12 - 6) + "px";
  s.style.fontSize = 8 + Math.random() * 8 + "px";
  document.body.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
});

// 3. Petals and butterflies
const layer = document.createElement("div");
layer.className = "fx-petal-layer";
layer.setAttribute("aria-hidden", "true");
for (let i = 0; i < PETAL_COUNT; i++) {
  const p = document.createElement("div");
  p.className = "fx-petal";
  const inner = document.createElement("span");
  inner.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  p.appendChild(inner);
  const dur = 14 + Math.random() * 12;
  p.style.top = Math.random() * 70 + "vh";
  p.style.fontSize = 12 + Math.random() * 10 + "px";
  p.style.setProperty("--dur", dur + "s");
  p.style.setProperty("--delay", -Math.random() * dur + "s");
  p.style.setProperty("--dip", Math.random() * 20 - 10 + "vh");
  p.style.setProperty("--fall", 10 + Math.random() * 25 + "vh");
  p.style.setProperty("--spin", 1.5 + Math.random() * 2 + "s");
  layer.appendChild(p);
}
document.body.appendChild(layer);
