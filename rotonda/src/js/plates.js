import gsap from 'gsap';

/**
 * One controller for every <video class="plate"> on the page.
 *
 * Everything routes through here rather than calling .play() in scattered
 * places, because the motion toggle has to reach ALL of them — including
 * the hero, which autoplays outside the lazy-load observers and is exactly
 * the one that gets forgotten.
 *
 * A plate plays only when all three are true:
 *   1. motion is enabled
 *   2. it is intersecting the viewport
 *   3. nothing has put it on hold (the walk holds its inactive steps)
 */
export class Plates {
  constructor() {
    this.videos = Array.from(document.querySelectorAll('video.plate'));
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.enabled = !this.reduced.matches;
    this.heroTick = null;

    this.hydrateObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) this.hydrate(e.target); }),
      { rootMargin: '200% 0px' }
    );

    // Tighter box than hydration: an off-screen video that is still playing
    // costs a decoder either way, so pause as soon as it leaves.
    this.playObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        e.target.dataset.inview = e.isIntersecting ? '1' : '0';
        this.sync(e.target);
      }),
      { rootMargin: '10% 0px' }
    );

    this.videos.forEach((v) => {
      v.dataset.inview = '0';
      this.hydrateObserver.observe(v);
      this.playObserver.observe(v);
    });

    // Hero must be ready before first paint of the section, not on scroll.
    this.hero = this.videos.filter((v) => v.dataset.plate === 'hero');
    this.hero.forEach((v) => this.hydrate(v));

    this.reduced.addEventListener('change', (e) => this.setEnabled(!e.matches));
  }

  hydrate(video) {
    if (video.dataset.hydrated === '1') return;
    video.dataset.hydrated = '1';
    video.querySelectorAll('source[data-src]').forEach((s) => {
      s.src = s.dataset.src;
      s.removeAttribute('data-src');
    });
    video.load();
    this.hydrateObserver.unobserve(video);
  }

  /** The walk parks its inactive steps here so they stop decoding. */
  hold(video, on) {
    video.dataset.hold = on ? '1' : '0';
    this.sync(video);
  }

  sync(video) {
    if (video.dataset.plate === 'hero') { this.syncHero(); return; }
    const wants = this.enabled && video.dataset.inview === '1' && video.dataset.hold !== '1';
    if (wants) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  }

  /** The hero is driven by the crossfade loop rather than by sync(), but it
   *  still has to stop when it scrolls away — otherwise its decoder runs for
   *  the whole session while the visitor is eight screens further down. */
  syncHero() {
    const [a, b] = this.hero;
    if (!a || !b) return;
    const inView = a.dataset.inview === '1' || b.dataset.inview === '1';
    if (this.enabled && inView) {
      const front = this.heroFront || a;
      if (front.paused) front.play().catch(() => {});
    } else {
      this.hero.forEach((v) => { if (!v.paused) v.pause(); });
    }
  }

  setEnabled(on) {
    this.enabled = on;
    if (on) this.startHero();
    this.videos.forEach((v) => this.sync(v));
    document.documentElement.dataset.motion = on ? 'on' : 'off';
  }

  /**
   * A forward dolly cannot loop on its own — the last frame is metres past
   * the first. Two stacked copies of the same file (one network fetch, the
   * browser caches it) crossfade into each other instead.
   */
  startHero() {
    const [a, b] = this.hero;
    if (!a || !b || this.heroTick) return;

    const FADE = 0.85;
    let front = a;
    let back = b;

    gsap.set(a, { opacity: 1 });
    gsap.set(b, { opacity: 0 });
    this.heroFront = a;
    this.syncHero();

    this.heroTick = () => {
      if (!this.enabled || front.paused) return;
      const d = front.duration;
      if (!d || front.currentTime < d - FADE) return;

      // Bind the two elements to consts BEFORE swapping. onComplete fires
      // 0.85s later, and a closure over the `front`/`back` bindings would by
      // then be pointing at the layer that just became visible — pausing the
      // plate instead of looping it.
      const outgoing = front;
      const incoming = back;

      incoming.currentTime = 0;
      incoming.play().catch(() => {});
      gsap.to(incoming, { opacity: 1, duration: FADE, ease: 'none' });
      gsap.to(outgoing, {
        opacity: 0, duration: FADE, ease: 'none',
        onComplete: () => outgoing.pause(),
      });

      front = incoming;
      back = outgoing;
      this.heroFront = front;
    };
    gsap.ticker.add(this.heroTick);
  }
}
