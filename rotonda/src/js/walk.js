import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The walk: five plates shot moving forward in one direction, so scroll
 * position genuinely is a position in the clinic. The clock is not a
 * decorative counter — it reads out where you are in 40 seconds of footage
 * (five plates, eight seconds each), which is a number a visitor could
 * derive from the material.
 *
 * Below 900px, or under reduced motion, none of this runs and the section
 * stays a plain stack of four blocks. That is the CSS default; the pinned
 * layout only exists while .walk--pinned is on the section.
 */
export function initWalk(plates) {
  const section = document.querySelector('.walk');
  if (!section) return;

  const stage = section.querySelector('.walk__stage');
  const panels = Array.from(section.querySelectorAll('.walk__panel'));
  const rows = Array.from(section.querySelectorAll('.walk__list li'));
  const clock = section.querySelector('#walk-clock');
  if (!stage || panels.length === 0) return;

  const SECONDS_PER_PLATE = 8;
  const START_AT = SECONDS_PER_PLATE; // reception is plate one, already seen in the hero

  const fmt = (s) => `00:${String(Math.round(s)).padStart(2, '0')}`;

  let current = -1;
  const setStep = (i) => {
    if (i === current) return;
    current = i;
    panels.forEach((p, n) => {
      const on = n === i;
      p.classList.toggle('is-on', on);
      const video = p.querySelector('video');
      if (video) {
        video.classList.toggle('is-on', on);
        plates.hold(video, !on);
      }
    });
    rows.forEach((r) => {
      const step = Number(r.dataset.step);
      r.classList.toggle('is-now', step === i);
      r.classList.toggle('is-past', step < i);
    });
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('walk--pinned');
    ScrollTrigger.refresh();

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => '+=' + window.innerHeight * panels.length,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const i = Math.min(panels.length - 1, Math.floor(p * panels.length));
        setStep(i);
        if (clock) {
          clock.textContent = fmt(START_AT + p * SECONDS_PER_PLATE * panels.length);
        }
      },
      onRefreshInit: () => setStep(0),
    });

    setStep(0);

    return () => {
      st.kill();
      section.classList.remove('walk--pinned');
      // Stacked fallback shows every panel, so nothing may stay held.
      panels.forEach((p) => {
        p.classList.add('is-on');
        const v = p.querySelector('video');
        if (v) { v.classList.add('is-on'); plates.hold(v, false); }
      });
      current = -1;
    };
  });

  // Stacked mode: all panels visible, each plate governed by its own
  // visibility rather than by the step machine.
  mm.add('(max-width: 899.98px), (prefers-reduced-motion: reduce)', () => {
    panels.forEach((p) => {
      p.classList.add('is-on');
      const v = p.querySelector('video');
      if (v) { v.classList.add('is-on'); plates.hold(v, false); }
    });
  });
}
