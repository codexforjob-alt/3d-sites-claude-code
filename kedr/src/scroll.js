import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis is driven from GSAP's ticker rather than its own requestAnimationFrame
 * loop. Two rAF loops is what makes pinned sections judder: Lenis writes a new
 * scroll position, ScrollTrigger reads it a frame later, and the pinned element
 * lands one frame behind the content sliding past it.
 */
export function initScroll(reduced) {
  if (reduced) return null;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Touch devices already have momentum scrolling; adding ours on top makes
    // the page feel detached from the finger.
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    });
  });

  return lenis;
}

export { gsap, ScrollTrigger };
