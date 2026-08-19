/**
 * Plates — one controller for every <video> on the page.
 *
 * Two things this exists to guarantee:
 *
 * 1. Nothing below the fold is fetched until it is near the viewport. Autoplay
 *    overrides `preload="metadata"`, so a page of autoplaying <video> pulls all
 *    of them at load; withholding the `src` is the only reliable way to stop
 *    that. First paint therefore costs the hero and nothing else.
 *
 * 2. There is exactly one place that decides whether a plate is running, so the
 *    motion toggle actually reaches all of them — including the hero, which
 *    autoplays outside the lazy-load observers and is the one everybody forgets.
 *    WCAG 2.2.2: these loops run well past five seconds and need a stop.
 */

const KEY = 'asd:motion';
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

const state = {
  on: true,        // is motion allowed at all
  visible: new Set(),
  videos: [],
};

function attach(video) {
  if (video.dataset.loaded) return;
  video.dataset.loaded = '1';
  // webm first: encode_plates.py deletes any webm that lost to its mp4, so a
  // webm that survived is genuinely the smaller file.
  for (const [attr, type] of [['webm', 'video/webm'], ['mp4', 'video/mp4']]) {
    const src = video.dataset[attr];
    if (src) video.append(Object.assign(document.createElement('source'), { src, type }));
  }
  video.load();
}

function sync() {
  for (const v of state.videos) {
    const wanted = state.on && state.visible.has(v);
    if (wanted) {
      attach(v);
      const p = v.play();
      // Autoplay can still be refused (low-power mode, data saver). The poster
      // is already showing, so there is nothing to do but not throw.
      if (p) p.catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  }
}

function buildToggle(bar) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'motion';
  btn.innerHTML = '<span class="motion__glyph" aria-hidden="true"></span>';
  bar.append(btn);

  const label = () => {
    btn.setAttribute('aria-pressed', String(state.on));
    btn.setAttribute('aria-label', state.on ? 'Остановить видео на странице' : 'Запустить видео на странице');
    btn.title = state.on ? 'Остановить видео' : 'Запустить видео';
    btn.classList.toggle('is-off', !state.on);
  };

  btn.addEventListener('click', () => {
    state.on = !state.on;
    try { localStorage.setItem(KEY, state.on ? 'on' : 'off'); } catch { /* private mode */ }
    label();
    sync();
  });

  label();
}

export function initPlates() {
  state.videos = [...document.querySelectorAll('video.plate')];
  if (!state.videos.length) return;

  // Reduced motion defaults the page to still, but the control stays available
  // so those visitors can opt back in rather than have it decided for them.
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch { /* private mode */ }
  state.on = stored ? stored === 'on' : !REDUCED.matches;

  const hero = document.querySelector('.hero__plate video');
  if (hero) hero.removeAttribute('autoplay');   // the controller starts it, or doesn't

  const bar = document.querySelector('.bar');
  if (bar) buildToggle(bar);

  // Attach early (400 px out) so a plate is decoded by the time it arrives…
  const loader = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting && state.on) attach(e.target);
  }, { rootMargin: '400px 0px' });

  // …and run only while actually on screen. An off-screen playing video costs
  // the same as one you can see.
  const player = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) state.visible.add(e.target);
      else state.visible.delete(e.target);
    }
    sync();
  }, { threshold: 0.15 });

  for (const v of state.videos) { loader.observe(v); player.observe(v); }

  REDUCED.addEventListener?.('change', (e) => {
    if (stored) return;               // an explicit choice wins over the OS
    state.on = !e.matches;
    sync();
  });
}
