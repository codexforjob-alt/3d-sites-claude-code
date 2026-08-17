import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { initScroll, ScrollTrigger } from './scroll.js';
import { createPlates } from './plates.js';
import { initRail } from './rail.js';
import { initChoreo } from './choreo.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Browsers restore scroll position on reload. With a preloader that means the
// curtain plays and then drops the visitor into the middle of the page.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const plates = createPlates({ reduced });
initScroll(reduced);
initChoreo(reduced);
initRail(reduced);

boot(plates.hero);

/**
 * Lift the curtain when the hero can actually paint something, or after a hard
 * cap, whichever comes first.
 *
 * The cap is the point. A gate that waits on `canplay` strands the page
 * forever if the decode fails, and a gate driven by requestAnimationFrame
 * hangs in a background tab because rAF is frozen there: the visitor opens the
 * link in a new tab, comes back a minute later, and finds a black screen.
 */
function boot(hero) {
  const body = document.body;
  const bar = document.querySelector('.preloader__bar i');
  const HARD_CAP = 2600;
  const started = performance.now();
  let done = false;

  const progress = setInterval(() => {
    if (!bar || done) return;
    const elapsed = (performance.now() - started) / HARD_CAP;
    bar.style.width = `${Math.min(94, elapsed * 100)}%`;
  }, 90);

  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(progress);
    clearTimeout(cap);
    if (bar) bar.style.width = '100%';

    // One frame for the bar to land, then release the page.
    setTimeout(() => {
      body.classList.remove('is-loading');
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }, 240);
  };

  const cap = setTimeout(finish, HARD_CAP);

  if (hero) {
    if (hero.readyState >= 2) finish();
    else {
      hero.addEventListener('canplay', finish, { once: true });
      hero.addEventListener('error', finish, { once: true });
    }
  } else {
    finish();
  }

  // Fonts settling changes line boxes, which moves every trigger start.
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}
