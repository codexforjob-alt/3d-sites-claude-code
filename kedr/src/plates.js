import { UI } from './content.js';

/**
 * One controller for every plate on the page, hero included.
 *
 * Two reasons it is centralised rather than a .play() sprinkled next to each
 * section: the motion toggle has to reach all of them (WCAG 2.2.2 wants a way
 * to stop anything that moves for longer than five seconds, and a hero that
 * autoplays outside the lazy-load observers is the one that always gets
 * forgotten), and ten videos decoding at once will spin a laptop fan up even
 * though nine of them are off screen.
 */
export function createPlates({ reduced }) {
  const videos = Array.from(document.querySelectorAll('video.plate'));
  const toggle = document.getElementById('motion-toggle');
  const label = toggle?.querySelector('.motion-toggle__label');

  // Under reduced motion nothing plays, but the control stays available so
  // those visitors can opt back in rather than having it decided for them.
  let enabled = !reduced;
  const inView = new Set();

  const hydrate = (video) => {
    if (video.dataset.hydrated) return;
    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.load();
    video.dataset.hydrated = '1';
  };

  const play = (video) => {
    if (!enabled) return;
    hydrate(video);
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  };

  // Enough of a head start that a plate is buffered on arrival, but not so much
  // that the section below the fold starts competing with the hero for
  // bandwidth on the first screen.
  const loader = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrate(entry.target);
        loader.unobserve(entry.target);
      });
    },
    { rootMargin: '350px 0px' }
  );

  // Tighter margin: an off-screen video that is still playing costs exactly as
  // much as one you can see.
  const player = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          inView.add(entry.target);
          play(entry.target);
        } else {
          inView.delete(entry.target);
          entry.target.pause();
        }
      });
    },
    { threshold: 0.01 }
  );

  videos.forEach((video) => {
    if (video.dataset.eager !== undefined) hydrate(video);
    else loader.observe(video);
    player.observe(video);
  });

  const paint = () => {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(enabled));
    if (label) label.textContent = enabled ? UI.motionOn : UI.motionOff;
  };

  const setEnabled = (next) => {
    enabled = next;
    if (enabled) inView.forEach(play);
    else videos.forEach((video) => video.pause());
    paint();
  };

  toggle?.addEventListener('click', () => setEnabled(!enabled));
  paint();

  return {
    get hero() {
      return videos.find((v) => v.dataset.plate === 'hero-room');
    },
    setEnabled,
    get enabled() {
      return enabled;
    },
  };
}
