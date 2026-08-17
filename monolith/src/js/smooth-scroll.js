import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * One rAF loop for the whole site. Lenis is driven by GSAP's ticker rather than
 * its own, so scroll position and every ScrollTrigger resolve in the same frame
 * — running both loops is what makes pinned sections judder.
 */
export function initSmoothScroll({ reducedMotion }) {
  if (reducedMotion) {
    ScrollTrigger.normalizeScroll(false);
    return null;
  }

  const lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    });
  });

  return lenis;
}
