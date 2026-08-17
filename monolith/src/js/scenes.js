import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/* ── Hero: the anamorphic desqueeze ────────────────────────────────────────
   The width axis of Archivo runs 62–125. Opening the headline from a squeeze
   to full width is the same move as a desqueeze on an anamorphic lens, which
   is the one liberty this design takes. It happens once, on first paint.     */
export function playHeroIntro({ reducedMotion }) {
  const title = document.getElementById('heroTitle');
  const lines = title ? title.querySelectorAll('.line__i') : [];

  if (reducedMotion) {
    gsap.set(lines, { y: 0, opacity: 1 });
    gsap.set(title, { fontVariationSettings: `'wdth' 116` });
    gsap.set('.hero [data-reveal], .hero__scroll', { opacity: 1, y: 0 });
    return gsap.timeline();
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.5, stagger: 0.09 }, 0)
    .fromTo(title,
      { fontVariationSettings: `'wdth' 74` },
      { fontVariationSettings: `'wdth' 116`, duration: 2.1, ease: 'expo.inOut' }, 0.1)
    .fromTo('.hero .eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 0.35)
    .fromTo('.hero__foot > *', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.75)
    .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.1)
    .fromTo('.head', { yPercent: -110 }, { yPercent: 0, duration: 1.1 }, 0.5);

  return tl;
}

export function buildScenes({ reducedMotion, gl }) {
  const mm = gsap.matchMedia();

  /* ── Scroll velocity feeds the hero shader ─────────────────────────────── */
  if (gl) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => gl.setVelocity(clamp(self.getVelocity() / 2600, -1, 1)),
      onLeave: () => gl.setVelocity(0),
    });
  }

  /* ── Header retracts going down, returns going up ──────────────────────── */
  const head = document.getElementById('head');
  ScrollTrigger.create({
    start: 'top -140',
    end: 'max',
    onUpdate: (self) => {
      head.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 260);
    },
  });

  /* ── Generic reveals ───────────────────────────────────────────────────── */
  if (!reducedMotion) {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      if (el.closest('.hero')) return; // owned by the intro timeline
      gsap.from(el, {
        opacity: 0,
        y: 26,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    gsap.from('.creed__cols p', {
      opacity: 0,
      y: 30,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: '.creed', start: 'top 78%', once: true },
    });
  }

  /* ── Hero plate drifts as you leave it ─────────────────────────────────── */
  mm.add('(min-width: 900px)', () => {
    gsap.to('.hero__body', {
      yPercent: -18,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 },
    });
  });

  /* ── Manifesto: lines light one at a time while the plate holds ────────── */
  const lines = gsap.utils.toArray('[data-mline]');
  if (lines.length) {
    ScrollTrigger.create({
      trigger: '.manifesto__pin',
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const lit = Math.floor(self.progress * (lines.length + 0.4));
        lines.forEach((line, i) => line.classList.toggle('is-lit', i <= lit - 1));
      },
    });

    gsap.to('.plate__video', {
      scale: 1.14,
      ease: 'none',
      scrollTrigger: { trigger: '.manifesto__pin', start: 'top top', end: '+=200%', scrub: true },
    });
  }

  /* ── Work: horizontal above 900px, plain stack below ───────────────────── */
  mm.add('(min-width: 900px)', () => {
    const track = document.getElementById('workTrack');
    if (!track) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.from('.work .panel', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.work', start: 'top 70%', once: true },
    });
  });

  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray('.work .panel').forEach((panel) => {
      gsap.from(panel, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
      });
    });
  });

  /* ── Ink wipe: one timeline in and out, so the two opacity tweens on the
        same element can never fight each other. ───────────────────────────── */
  const wipe = document.querySelector('.wipe__video');
  if (wipe) {
    gsap.timeline({
      scrollTrigger: { trigger: '.wipe', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    })
      .fromTo(wipe, { opacity: 0, scale: 1.28 }, { opacity: 1, scale: 1, ease: 'none', duration: 0.55 })
      .to(wipe, { opacity: 0, ease: 'none', duration: 0.45 });
  }

  /* ── Studio ticker ─────────────────────────────────────────────────────── */
  const row = document.getElementById('tickerRow');
  if (row && !reducedMotion) {
    [...row.children].forEach((node) => row.appendChild(node.cloneNode(true)));
    gsap.to(row, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 });
  }

  /* ── Contact: plate parallax + the second desqueeze ────────────────────── */
  const contactVideo = document.querySelector('.contact__video');
  if (contactVideo) {
    gsap.fromTo(contactVideo,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      });
  }

  const contactTitle = document.getElementById('contactTitle');
  if (contactTitle) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.contact', start: 'top 62%', once: true },
    });
    tl.fromTo(contactTitle.querySelectorAll('.line__i'),
      { yPercent: 112 },
      { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 }, 0);

    if (!reducedMotion) {
      tl.fromTo(contactTitle,
        { fontVariationSettings: `'wdth' 74` },
        { fontVariationSettings: `'wdth' 116`, duration: 1.9, ease: 'expo.inOut' }, 0);
    }
  }

  ScrollTrigger.refresh();
}
