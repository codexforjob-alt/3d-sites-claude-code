import '../css/main.css';

import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { initPlates } from './plates.js';
import { initEstimate } from './estimate.js';
import { initDemo } from './demo.js';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── one rAF loop ─────────────────────────────────────────────────────────
   Lenis is driven from GSAP's ticker rather than its own requestAnimationFrame.
   Two loops is what makes scroll-linked elements judder: they tick in a
   different order every frame and the trigger reads a scroll position that is
   one frame stale. */
let lenis = null;

if (!REDUCED) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── in-page links ──────────────────────────────────────────────────────── */
// The demo banner sits above the header, so anchors have to clear both.
const px = (name, fallback) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback;
const OFFSET = () => px('--bar-h', 58) + (document.querySelector('.demo')?.offsetHeight || 0);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -OFFSET() - 12 });
    else target.scrollIntoView({ block: 'start' });
  });
});

/* ── reveals ────────────────────────────────────────────────────────────
   Deliberately the only choreography on the page. The estimator is where the
   attention is meant to go; everything else just arrives without fuss. */
function initReveals() {
  if (REDUCED) return;

  const groups = [
    ...document.querySelectorAll('.sheet__head'),
    ...document.querySelectorAll('.tablewrap'),
    ...document.querySelectorAll('.cols > *'),
    ...document.querySelectorAll('.versus__col'),
    ...document.querySelectorAll('.steps > li'),
    ...document.querySelectorAll('.rules > li'),
    ...document.querySelectorAll('.figures > div'),
    ...document.querySelectorAll('.calc__q'),
    ...document.querySelectorAll('.close__inner > *'),
  ];

  groups.forEach((el) => el.classList.add('rise'));

  ScrollTrigger.batch(groups, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0, duration: 0.62, ease: 'power2.out', stagger: 0.055,
      onStart: () => batch.forEach((el) => el.classList.add('is-in')),
    }),
  });
}

/* ── the running estimate ───────────────────────────────────────────────── */
function initDock(est) {
  if (!est) return;
  const { dock, isTouched } = est;
  const estimate = document.getElementById('estimate');
  const contact = document.getElementById('contact');
  if (!estimate || !contact) return;

  // The dock carries the number away from the calculator, so it has no business
  // being on screen at the same time as the calculator — it sat on top of the
  // last question — nor over the closing block, whose WhatsApp button is right
  // there. It is for the stretch in between.
  const blocked = { calc: false, close: false };
  const apply = () => dock.classList.toggle('is-up', isTouched() && !blocked.calc && !blocked.close);

  est.onTouch = apply;

  const calcST = ScrollTrigger.create({
    trigger: estimate, start: 'top bottom', end: 'bottom top',
    onToggle: (self) => { blocked.calc = self.isActive; apply(); },
  });
  blocked.calc = calcST.isActive;   // onToggle only fires on a change
  ScrollTrigger.create({
    trigger: contact, start: `top ${window.innerHeight - 140}px`,
    onEnter: () => { blocked.close = true; apply(); },
    onLeaveBack: () => { blocked.close = false; apply(); },
  });
}

initDemo();
initPlates();
initReveals();
initDock(initEstimate());

// Fonts land after first paint and change every measurement on the page.
if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
