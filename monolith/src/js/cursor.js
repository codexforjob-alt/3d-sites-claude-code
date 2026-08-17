import gsap from 'gsap';

/** A single dot on difference blend. It grows over anything clickable. */
export function initCursor() {
  const el = document.getElementById('cursor');
  if (!el) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const set = { x: gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' }),
                y: gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' }) };

  window.addEventListener('pointermove', (event) => {
    set.x(event.clientX);
    set.y(event.clientY);
  }, { passive: true });

  const targets = 'a, button, [data-case], .crow';
  document.addEventListener('pointerover', (event) => {
    if (event.target.closest(targets)) el.classList.add('is-big');
  });
  document.addEventListener('pointerout', (event) => {
    if (event.target.closest(targets)) el.classList.remove('is-big');
  });
}
