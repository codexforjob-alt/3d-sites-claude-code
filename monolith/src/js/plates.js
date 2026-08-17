/**
 * Every video plate on the page runs through here.
 *
 * Three jobs. Ten clips is a lot of decoder, so nothing loads until it is nearly
 * on screen and everything pauses the moment it leaves — an off-screen <video>
 * that is still playing costs the same CPU as one you can see.
 *
 * The third job is the reason this is a controller and not a loop: WCAG 2.2.2
 * asks for a way to stop anything that plays by itself for more than five
 * seconds. These plates loop forever. Honouring prefers-reduced-motion covers
 * the people who have set it; the header toggle covers everyone who hasn't but
 * still wants the movement to stop.
 */

const LOAD_MARGIN = '120% 0px';
const PLAY_MARGIN = '15% 0px';

const registry = new Set();
const visible = new WeakSet();
let motionOn = true;

function hydrate(video) {
  if (video.dataset.hydrated) return;
  video.dataset.hydrated = '1';
  video.querySelectorAll('source[data-src]').forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
  });
  video.load();
}

function sync(video) {
  if (motionOn && visible.has(video)) {
    hydrate(video);
    video.play().catch(() => {});
  } else if (!video.paused) {
    video.pause();
  }
}

/** True unless the visitor has asked their system for less movement. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function motionEnabled() {
  return motionOn;
}

export function setMotion(enabled) {
  motionOn = enabled;
  document.documentElement.classList.toggle('motion-off', !enabled);
  registry.forEach(sync);

  const grain = document.getElementById('grain');
  if (grain) grain.classList.toggle('is-on', enabled && grain.dataset.eligible === '1');
}

export function initPlates(root = document) {
  const videos = [...root.querySelectorAll('[data-lazy-video]')];
  videos.forEach((v) => registry.add(v));
  if (!videos.length) return;

  if (!('IntersectionObserver' in window)) {
    videos.forEach((v) => { visible.add(v); sync(v); });
    return;
  }

  const loader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // Hydrate even with motion off — the poster is the frame the visitor
      // sees, and a paused, decoded video shows its first frame reliably.
      hydrate(entry.target);
      loader.unobserve(entry.target);
    });
  }, { rootMargin: LOAD_MARGIN });

  const player = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
      sync(entry.target);
    });
  }, { rootMargin: PLAY_MARGIN });

  videos.forEach((video) => {
    loader.observe(video);
    player.observe(video);
  });
}

/** The grain plate is fixed and always on screen, so it sits outside the observers. */
export function initGrain() {
  const grain = document.getElementById('grain');
  if (!grain) return;
  if (window.matchMedia('(max-width: 899px)').matches) return; // not worth the battery
  if (prefersReducedMotion()) return;

  grain.dataset.eligible = '1';
  const video = grain.querySelector('video');
  registry.add(video);
  visible.add(video);
  hydrate(video);

  if (!motionOn) return;
  video.play().then(() => grain.classList.add('is-on')).catch(() => {});
}

/**
 * The hero plate autoplays outside the observers because it is the first thing
 * painted, but it still answers to the toggle.
 */
export function registerHero(video) {
  if (!video) return;
  registry.add(video);
  visible.add(video);
  sync(video);
}

export function initMotionToggle() {
  const button = document.getElementById('motionToggle');
  if (!button) return;

  const label = button.querySelector('.motion__label');

  const paint = () => {
    button.setAttribute('aria-pressed', String(!motionOn));
    button.setAttribute('aria-label', motionOn ? 'Pause all motion' : 'Resume motion');
    if (label) label.textContent = motionOn ? 'Pause' : 'Play';
  };

  setMotion(!prefersReducedMotion());
  paint();

  button.addEventListener('click', () => {
    setMotion(!motionOn);
    paint();
  });
}
