/**
 * Demo mode.
 *
 * The page carries a real company's name, phone number and email, and every
 * price on it is invented. That combination is fine while it is understood to
 * be a mock-up and dangerous the moment somebody takes it for the live site and
 * rings the number quoting a figure off it.
 *
 * So in demo mode the outbound contact actions are inert. The number stays
 * visible — it is the client's own and it is public — but nothing on this page
 * will dial it, open WhatsApp, or start an email with a made-up total in the
 * body.
 *
 * One switch: the `.demo` banner element in index.html. Delete it and the site
 * is live — this module finds nothing to disable and every link works again.
 */

/** True once initDemo has found the banner. Anything that writes an href at
 *  runtime has to ask — initDemo only strips what exists when it runs. */
export const isDemo = () => document.documentElement.hasAttribute('data-demo');

export function initDemo() {
  const banner = document.querySelector('.demo');
  if (!banner) return false;

  document.documentElement.dataset.demo = '';

  const note = document.createElement('span');
  note.className = 'demo-note';
  note.setAttribute('role', 'status');
  note.textContent = 'В демо-макете связь с компанией отключена';

  for (const el of document.querySelectorAll('[data-contact]')) {
    el.removeAttribute('href');
    el.removeAttribute('target');
    el.setAttribute('role', 'link');
    el.setAttribute('aria-disabled', 'true');
    el.tabIndex = 0;   // still reachable, so the reason is discoverable
    el.addEventListener('click', (e) => {
      e.preventDefault();
      show(el);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(el); }
    });
  }

  let timer;
  function show(el) {
    el.after(note);
    note.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(() => note.classList.remove('is-on'), 2600);
  }

  return true;
}
