import { gsap, ScrollTrigger } from './scroll.js';

/**
 * All scroll choreography.
 *
 * Everything here animates *from* an offset toward the state the CSS already
 * describes. Nothing sets a resting value in JavaScript, so skipping any of it
 * — reduced motion, a failed bundle, JS switched off — leaves the page correct
 * rather than frozen half-revealed.
 *
 * Deliberately restrained: the plates already contain camera movement, so the
 * page does not add its own. Scroll-driven scale on top of a dolly shot makes
 * two moves compete and neither one wins.
 */
export function initChoreo(reduced) {
  // Bail before touching a single property. Setting the start state and relying
  // on a tween to undo it is what leaves a reduced-motion visitor staring at a
  // page of invisible paragraphs — the CSS already describes the finished
  // state, so doing nothing here is doing the right thing.
  if (reduced) return;

  const mm = gsap.matchMedia();

  heroIntro();

  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.07,
        overwrite: true,
      }),
  });
  gsap.set('.reveal', { autoAlpha: 0, y: 22 });

  // The pin only exists where there is room for it. On a phone the three beats
  // simply stack and read as normal paragraphs.
  mm.add('(min-width: 60rem)', () => {
    const section = document.getElementById('pech');
    const stage = document.getElementById('pin-stage');
    const beatsEl = document.getElementById('beats');
    if (!section || !stage || !beatsEl) return;

    const beats = gsap.utils.toArray('.beat', beatsEl);
    beatsEl.classList.add('is-stacked');
    gsap.set(beats, { autoAlpha: 0, y: 20 });
    gsap.set(beats[0], { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: false,
        scrub: 0.55,
      },
    });

    beats.forEach((beat, i) => {
      if (i === 0) return;
      tl.to(beats[i - 1], { autoAlpha: 0, y: -20, duration: 0.45 }, i)
        .to(beat, { autoAlpha: 1, y: 0, duration: 0.45 }, i);
    });

    return () => {
      beatsEl.classList.remove('is-stacked');
      gsap.set(beats, { clearProps: 'all' });
    };
  });

  mm.add('(min-width: 60rem)', () => {
    const line = document.querySelector('.hero__hint-line');
    if (!line) return;
    const tween = gsap.fromTo(
      line,
      { scaleX: 0.2 },
      {
        scaleX: 1,
        duration: 1.6,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      }
    );
    return () => tween.kill();
  });
}

function heroIntro() {
  const lines = gsap.utils.toArray('.hero__title .mask__line');
  if (!lines.length) return;

  gsap.from(lines, {
    yPercent: 112,
    duration: 1.15,
    ease: 'expo.out',
    stagger: 0.085,
    delay: 0.12,
  });
}
