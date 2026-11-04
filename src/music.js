// Soft background music for every page (loaded from snowflakes.js).
// Starts on the visitor's first click/tap/key, keeps playing from the same spot
// when moving between pages, and has a 🎵 button (bottom-right) to turn it off.

const SRC = "/music/Love%20Letter.mp3";
const VOLUME = 0.15; // 0 = silent, 1 = full volume

const KEY_ON = "bgm-on";     // remembers if the visitor turned music off
const KEY_TIME = "bgm-time"; // where the song was when leaving the page

const store = {
  get(area, k) { try { return window[area].getItem(k); } catch { return null; } },
  set(area, k, v) { try { window[area].setItem(k, v); } catch {} },
};

const audio = new Audio(SRC);
audio.loop = true;
audio.volume = VOLUME;
audio.preload = "auto";

const savedTime = parseFloat(store.get("sessionStorage", KEY_TIME));
if (!Number.isNaN(savedTime)) {
  audio.addEventListener("loadedmetadata", () => {
    audio.currentTime = savedTime % (audio.duration || Infinity);
  }, { once: true });
}

const wantsMusic = () => store.get("localStorage", KEY_ON) !== "off";

// Button
const style = document.createElement("style");
style.textContent = `
  .bgm-btn { position: fixed; right: 18px; bottom: 18px; z-index: 10001;
    width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
    border: 1px solid rgba(196,168,255,.5); background: rgba(40,30,70,.75);
    color: #f0eeff; font-size: 20px; line-height: 1;
    box-shadow: 0 0 14px rgba(167,139,250,.45); backdrop-filter: blur(6px);
    transition: transform .2s ease, opacity .2s ease; }
  .bgm-btn:hover { transform: scale(1.08); }
  .bgm-btn.is-off { opacity: .55; }
  .bgm-btn.is-playing { animation: bgm-pulse 2.4s ease-in-out infinite; }
  @keyframes bgm-pulse { 50% { box-shadow: 0 0 22px rgba(196,168,255,.8); } }
`;
document.head.appendChild(style);

const btn = document.createElement("button");
btn.className = "bgm-btn";
btn.type = "button";
document.body.appendChild(btn);

function render() {
  const playing = !audio.paused;
  btn.textContent = playing ? "🎵" : "🔇";
  btn.classList.toggle("is-playing", playing);
  btn.classList.toggle("is-off", !playing);
  btn.setAttribute("aria-label", playing ? "Turn music off" : "Turn music on");
  btn.title = playing ? "Music on (click to turn off)" : "Music off (click to turn on)";
}

function play() {
  return audio.play().then(render).catch(render);
}

audio.addEventListener("play", render);
audio.addEventListener("pause", render);
render();

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (audio.paused) {
    store.set("localStorage", KEY_ON, "on");
    play();
  } else {
    store.set("localStorage", KEY_ON, "off");
    audio.pause();
  }
});

// Try to continue right away (works after the visitor has already clicked on an earlier page in most browsers)
if (wantsMusic()) play();

// Otherwise start on the first interaction anywhere on the page
function firstInteraction(e) {
  if (e.target === btn) return;
  if (wantsMusic() && audio.paused) play();
  ["pointerdown", "keydown"].forEach((t) => window.removeEventListener(t, firstInteraction));
}
["pointerdown", "keydown"].forEach((t) => window.addEventListener(t, firstInteraction));

// Remember the position so the next page continues from the same spot
const saveTime = () => store.set("sessionStorage", KEY_TIME, String(audio.currentTime));
window.addEventListener("pagehide", saveTime);
setInterval(() => { if (!audio.paused) saveTime(); }, 1000);
