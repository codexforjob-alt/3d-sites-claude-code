/**
 * The reel is ten clips at eight seconds, twenty-four frames a second.
 * Scroll position is the playhead; the rail reads out real timecode against
 * that eighty-second runtime rather than an invented percentage.
 */

export const FPS = 24;
export const RUNTIME = 80; // seconds

export function frames(seconds) {
  const total = Math.max(0, Math.round(seconds * FPS));
  const ff = total % FPS;
  const ss = Math.floor(total / FPS) % 60;
  const mm = Math.floor(total / (FPS * 60)) % 60;
  const hh = Math.floor(total / (FPS * 3600));
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

export function initRail() {
  const rail = document.getElementById('rail');
  if (!rail) return () => {};

  const fill = document.getElementById('railFill');
  const head = document.getElementById('railHead');
  const readout = document.getElementById('railTc');
  const list = document.getElementById('railMarks');

  const sections = [...document.querySelectorAll('[data-tc][data-label]')];
  const marks = sections.map((section) => {
    const li = document.createElement('li');
    li.className = 'rail__mark';
    const label = document.createElement('span');
    label.textContent = section.dataset.label;
    li.appendChild(label);
    list.appendChild(li);
    return { el: li, section };
  });

  const place = () => {
    const doc = document.documentElement.scrollHeight - window.innerHeight;
    if (doc <= 0) return;
    marks.forEach(({ el, section }) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      el.style.top = `${Math.min(100, (top / doc) * 100)}%`;
    });
  };

  let lastFrame = -1;

  const update = () => {
    const doc = document.documentElement.scrollHeight - window.innerHeight;
    const progress = doc > 0 ? Math.min(1, Math.max(0, window.scrollY / doc)) : 0;

    fill.style.height = `${progress * 100}%`;
    head.style.transform = `translateY(${progress * (rail.clientHeight * 0.68)}px)`;

    const frame = Math.round(progress * RUNTIME * FPS);
    if (frame !== lastFrame) {
      lastFrame = frame;
      readout.textContent = frames(progress * RUNTIME);
    }

    marks.forEach(({ el, section }) => {
      const box = section.getBoundingClientRect();
      el.classList.toggle('is-on', box.top <= window.innerHeight * 0.5 && box.bottom > window.innerHeight * 0.5);
    });
  };

  place();
  update();
  window.addEventListener('resize', () => { place(); update(); });

  return update;
}

/**
 * Counts the preloader up to 00:00:08:00 — one clip's worth — then resolves.
 * rAF is frozen in a background tab, so a timer backstop resolves the promise
 * regardless; without it the curtain never lifts for anyone who opens the site
 * in a tab they aren't looking at yet.
 */
export function runPreloaderCount(el, duration = 1500) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      el.textContent = frames(8);
      resolve();
    };

    const backstop = setTimeout(finish, duration + 500);
    const start = performance.now();

    const tick = (now) => {
      if (settled) return;
      const t = Math.min(1, (now - start) / duration);
      el.textContent = frames((1 - Math.pow(1 - t, 3)) * 8);
      if (t < 1) requestAnimationFrame(tick);
      else { clearTimeout(backstop); finish(); }
    };

    requestAnimationFrame(tick);
  });
}
