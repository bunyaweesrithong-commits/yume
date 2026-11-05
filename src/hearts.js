// Floating hearts in the background of every page (loaded from snowflakes.js).
// Pink/purple hearts rise slowly from the bottom, sway, and drift away from the mouse or finger.

const COLORS = ["#ff8fc7", "#f472b6", "#e879f9", "#c4a8ff", "#fbcfe8"];
const isSmall = window.matchMedia("(max-width: 640px)").matches;
const COUNT = isSmall ? 18 : 36;

const canvas = document.createElement("canvas");
canvas.setAttribute("aria-hidden", "true");
Object.assign(canvas.style, {
  position: "fixed", inset: "0", width: "100%", height: "100%",
  pointerEvents: "none", zIndex: "-1",
});
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");

let W = 0, H = 0, dpr = 1;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener("resize", resize);

const rand = (a, b) => a + Math.random() * (b - a);
function makeHeart(startAnywhere) {
  const size = rand(10, isSmall ? 30 : 42);
  return {
    x: rand(0, W), y: startAnywhere ? rand(0, H) : H + size,
    size, speed: rand(0.25, 0.8) * (size / 30 + 0.5),
    sway: rand(0.4, 1.2), phase: rand(0, Math.PI * 2),
    alpha: rand(0.25, 0.7), blur: Math.random() < 0.35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    pushX: 0, pushY: 0, spin: rand(-0.3, 0.3),
  };
}
const hearts = Array.from({ length: COUNT }, () => makeHeart(true));

function drawHeart(h, t) {
  const s = h.size;
  ctx.save();
  ctx.translate(h.x + Math.sin(t * 0.001 * h.sway + h.phase) * 18 + h.pushX, h.y + h.pushY);
  ctx.rotate(Math.sin(t * 0.0008 + h.phase) * h.spin);
  ctx.globalAlpha = h.alpha;
  ctx.fillStyle = h.color;
  ctx.shadowColor = h.color;
  ctx.shadowBlur = h.blur ? 18 : 6;
  if (h.blur) ctx.filter = "blur(2px)";
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.75, 0, s);
  ctx.bezierCurveTo(0, s * 0.75, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
  ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

// Hearts drift away from the mouse / finger
let pointer = { x: -9999, y: -9999 };
window.addEventListener("pointermove", (e) => { pointer = { x: e.clientX, y: e.clientY }; });
window.addEventListener("pointerleave", () => { pointer = { x: -9999, y: -9999 }; });

const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < hearts.length; i++) {
    const h = hearts[i];
    if (!still) {
      h.y -= h.speed;
      const dx = h.x + h.pushX - pointer.x, dy = h.y + h.pushY - pointer.y;
      const d = Math.hypot(dx, dy);
      if (d < 120 && d > 0) {
        const f = (120 - d) / 120 * 4;
        h.pushX += (dx / d) * f; h.pushY += (dy / d) * f;
      }
      h.pushX *= 0.95; h.pushY *= 0.95; // ease back
      if (h.y < -h.size * 2) hearts[i] = makeHeart(false);
    }
    drawHeart(hearts[i], still ? 0 : t);
  }
  if (!still) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
