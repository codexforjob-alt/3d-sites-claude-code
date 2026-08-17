import { SECTIONS } from './content.js';
import { gsap, ScrollTrigger } from './scroll.js';

/**
 * The rail is the one structural device on the page, and the reason it earns
 * its place is that a visitor could derive every number on it from the footage
 * and the copy: the oven really does run at 480, the case at 2, the rice at
 * body temperature. Numbered markers (01 / 02 / 03) would have been decoration
 * wearing a uniform, because these sections are not a sequence.
 *
 * The same value drives --heat, so the accent colour cools from ember to steel
 * as the page walks from the oven to the ice and back.
 */
export function initRail(reduced) {
  const value = document.getElementById('rail-value');
  const measures = document.getElementById('rail-measures');
  const tick = document.getElementById('rail-tick');
  const root = document.documentElement;
  if (!value || !measures || !tick) return;

  const setReading = (section) => {
    if (
      reduced ||
      (value.textContent === section.reading && measures.textContent === section.measures)
    ) {
      // Swap outright rather than cross-fading. A 0.16s fade is harmless until
      // the ticker stalls, and then the readout is stuck at zero opacity.
      value.textContent = section.reading;
      measures.textContent = section.measures;
      root.style.setProperty('--heat', String(section.heat));
      return;
    }
    gsap.to([value, measures], {
      autoAlpha: 0,
      duration: 0.16,
      ease: 'none',
      onComplete: () => {
        value.textContent = section.reading;
        measures.textContent = section.measures;
        gsap.to([value, measures], { autoAlpha: 1, duration: 0.24, ease: 'none' });
      },
    });
    root.style.setProperty('--heat', String(section.heat));
  };

  SECTIONS.forEach((section) => {
    const el = document.getElementById(section.id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => setReading(section),
      onEnterBack: () => setReading(section),
    });
  });

  // The tick rides the whole document, so the seam reads as a playhead rather
  // than as a per-section progress bar.
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      gsap.set(tick, { top: `${self.progress * 100}%`, yPercent: -50 });
    },
  });

  const first = SECTIONS[0];
  value.textContent = first.reading;
  measures.textContent = first.measures;
  root.style.setProperty('--heat', String(first.heat));
}
