import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { initPlates, initGrain, initMotionToggle, registerHero } from './js/plates.js';
import { initSmoothScroll } from './js/smooth-scroll.js';
import { initRail, runPreloaderCount } from './js/timecode.js';
import { initCursor } from './js/cursor.js';
import { playHeroIntro, buildScenes } from './js/scenes.js';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.body.classList.add('is-loading');

// A reload halfway down the page would otherwise play the preloader and then
// drop the visitor into the middle of the reel. The reel always starts at zero.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/**
 * Resolves when the hero plate can actually paint, or after a hard cap. The
 * element carries no `autoplay` — the motion controller decides whether it
 * runs — so `preload="auto"` is what gets the first frame decoded in time.
 */
function heroReady(video, cap = 4000) {
  return new Promise((resolve) => {
    if (!video) return resolve();
    if (video.readyState >= 3) return resolve();
    const done = () => resolve();
    video.addEventListener('canplay', done, { once: true });
    video.addEventListener('error', done, { once: true });
    setTimeout(done, cap);
  });
}

async function boot() {
  const heroVideo = document.getElementById('heroVideo');
  const preloader = document.getElementById('preloader');
  const counter = document.getElementById('preloaderTc');

  initPlates();
  initMotionToggle();
  initCursor();

  // Three.js is ~600 kB and the shader only ever runs on a pointer-driven
  // desktop. Loading it as a separate chunk keeps phones — which fall back to
  // the plain <video> and look identical at rest — off that download entirely.
  let gl = null;
  const wantsGl = !reducedMotion && window.matchMedia('(min-width: 900px)').matches;

  if (wantsGl) {
    try {
      const { initHeroGl } = await import('./js/hero-gl.js');
      gl = initHeroGl({ video: heroVideo, canvas: document.getElementById('heroGl'), reducedMotion });
      if (gl) gsap.ticker.add((time) => gl.render(time));
    } catch {
      gl = null; // the <video> underneath is already the fallback
    }
  }

  // Hold the curtain for the counter and the first frame, whichever is slower.
  await Promise.all([
    runPreloaderCount(counter, reducedMotion ? 400 : 1500),
    heroReady(heroVideo),
  ]);

  // Goes through the controller rather than .play() so the toggle owns it too.
  registerHero(heroVideo);
  if (gl) gl.reveal();

  const lenis = initSmoothScroll({ reducedMotion });
  const updateRail = initRail();

  document.body.classList.remove('is-loading');

  const exit = gsap.timeline({
    onComplete: () => {
      preloader.remove();
      initGrain();
      buildScenes({ reducedMotion, gl });
      ScrollTrigger.refresh();
    },
  });

  if (reducedMotion) {
    exit.to(preloader, { opacity: 0, duration: 0.2 })
        .add(playHeroIntro({ reducedMotion }), 0);
  } else {
    exit
      .to('.preloader__meta', { opacity: 0, duration: 0.4, ease: 'power2.in' })
      .to('.preloader__strip', { scaleX: 1.6, opacity: 0, duration: 0.7, ease: 'expo.in' }, 0.1)
      .to(preloader, { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, 0.35)
      .add(playHeroIntro({ reducedMotion }), 0.75);
  }

  if (lenis) {
    lenis.on('scroll', updateRail);
  } else {
    window.addEventListener('scroll', updateRail, { passive: true });
  }

  // Fonts land after first paint; pinned distances are measured off the layout.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

boot();
