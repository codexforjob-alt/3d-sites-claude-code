import '../css/main.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { Plates } from './plates.js';
import { initWalk } from './walk.js';
import { initForm } from './form.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   Browsers restore scroll position on reload. With a boot curtain that
   means the curtain plays and then drops the visitor into the middle of
   the page, which reads as a bug.
   ------------------------------------------------------------------ */
/* ScrollTrigger caches whatever history.scrollRestoration was at init and
   writes it back on every refresh, so setting the property directly gets
   silently reverted a few hundred ms later. clearScrollMemory is the
   supported way in: it updates ScrollTrigger's cached value too. */
const lockRestore = () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  ScrollTrigger.clearScrollMemory('manual');
};
lockRestore();
window.scrollTo(0, 0);

/* ------------------------------------------------------------------
   Smooth scroll — driven from GSAP's ticker so there is ONE rAF loop.
   Two loops is what makes pinned sections judder.
   ------------------------------------------------------------------ */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Re-assert after Lenis is up, and again on pageshow for the bfcache path —
// otherwise a reload plays the boot curtain and then drops the visitor into
// the middle of the page.
lockRestore();
window.addEventListener('pageshow', () => {
  lockRestore();
  window.scrollTo(0, 0);
  if (lenis) lenis.scrollTo(0, { immediate: true });
});

const goTo = (target) => {
  if (lenis) lenis.scrollTo(target, { offset: -70 });
  else target.scrollIntoView({ behavior: 'auto', block: 'start' });
};

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    goTo(target);
  });
});

/* ------------------------------------------------------------------
   Plates, walk, form
   ------------------------------------------------------------------ */
const plates = new Plates();
document.documentElement.dataset.motion = plates.enabled ? 'on' : 'off';
initWalk(plates);
initForm();

/* Motion toggle. WCAG 2.2.2 wants a way to stop anything that moves for
   longer than five seconds; looping plates are exactly that. Default it
   off under reduced motion but leave the control so those visitors can
   opt back in rather than having it decided for them. */
const motionBtn = document.getElementById('motion');
if (motionBtn) {
  const label = motionBtn.querySelector('.motion__label');
  const paint = (on) => {
    motionBtn.setAttribute('aria-pressed', String(on));
    label.textContent = on ? 'Видео' : 'Видео выкл.';
    motionBtn.title = on ? 'Остановить видео' : 'Включить видео';
  };
  paint(plates.enabled);
  motionBtn.addEventListener('click', () => {
    const next = motionBtn.getAttribute('aria-pressed') !== 'true';
    plates.setEnabled(next);
    paint(next);
  });
}

/* ------------------------------------------------------------------
   Header
   ------------------------------------------------------------------ */
const head = document.getElementById('head');
if (head) {
  ScrollTrigger.create({
    start: 90,
    end: 'max',
    onToggle: (self) => head.classList.toggle('is-stuck', self.isActive),
  });

  // Invert the header while it sits over a dark section. Computed from the
  // header's own mid-line rather than with one trigger per section, because
  // two triggers toggling the same class fight at the boundary between them.
  const darkSections = ['.craft', '.foot']
    .map((s) => document.querySelector(s))
    .filter(Boolean);
  const paintHead = () => {
    const line = head.offsetHeight / 2;
    const dark = darkSections.some((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= line && r.bottom >= line;
    });
    head.classList.toggle('head--dark', dark);
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: paintHead, onRefresh: paintHead });
  paintHead();
}

/* ------------------------------------------------------------------
   Reveals. Skipped entirely under reduced motion — the CSS resting state
   is already the finished state, so there is nothing left frozen.
   ------------------------------------------------------------------ */
if (!reduced) {
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 22,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Display headlines below the fold; the hero's runs when the curtain lifts.
  gsap.utils.toArray('.display').forEach((h) => {
    if (h.closest('.hero')) return;
    gsap.from(h.querySelectorAll('.line > span'), {
      yPercent: 110,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true },
    });
  });

  gsap.to('.wipe__plate', {
    scale: 1.08,
    ease: 'none',
    scrollTrigger: { trigger: '.wipe', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

/* ------------------------------------------------------------------
   Boot curtain.

   Never gate this on requestAnimationFrame or on a video's canplay: rAF
   is frozen in a background tab and a failed decode never fires, either
   of which leaves someone staring at a blank screen. A plain timer runs
   in both cases, so the timer is the authority and everything else only
   makes it lift sooner.
   ------------------------------------------------------------------ */
const boot = document.getElementById('boot');
let lifted = false;

function lift() {
  if (lifted) return;
  lifted = true;
  document.documentElement.classList.remove('is-loading');

  const heroLines = document.querySelectorAll('.hero .display .line > span');
  if (!reduced && heroLines.length) {
    gsap.from(heroLines, {
      yPercent: 110, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.1,
    });
  }
  if (plates.enabled) plates.startHero();

  if (!boot) return ScrollTrigger.refresh();

  // The fade is a CSS transition and the removal is a timer, because GSAP's
  // ticker rides requestAnimationFrame and rAF is frozen in a background
  // tab. A tween here leaves the curtain sitting at full opacity — opaque
  // AND swallowing clicks — for anyone who opens the link in a new tab and
  // switches to it a minute later. setTimeout still fires when hidden.
  boot.classList.add('is-gone');
  setTimeout(() => { boot.remove(); ScrollTrigger.refresh(); }, 650);
}

if (boot && !reduced) {
  gsap.from(boot.querySelector('.boot__mark span'), {
    yPercent: 110, duration: 0.7, ease: 'power3.out',
  });
}

setTimeout(lift, 1500);                                   // authority
window.addEventListener('load', () => setTimeout(lift, 200)); // usually sooner
