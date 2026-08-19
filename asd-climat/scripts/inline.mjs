/**
 * Pack dist/ into one self-contained HTML file.
 *
 * For hosts that will only take a single file (an Artifact page, an email
 * preview, a folder handed to a client). Everything travels inside the
 * document — fonts, posters, video, CSS, JS — so the page has no network
 * dependency at all.
 *
 * The trade-off is real and worth stating: the deployed site downloads 480 KB
 * for the first screen and fetches each plate only as it nears the viewport.
 * This file has no such option — every byte is in the document. Use it to show
 * the site, not to serve it.
 *
 * Two things here are not obvious:
 *
 *   1. Video cannot be a `data:` URI. Chromium answers a megabyte-scale
 *      `data:video/mp4` with networkState 3 (NO_SOURCE) and no error object —
 *      it simply refuses. The clips therefore ride as base64 in a JSON block
 *      and a bootstrap turns them into blob: URLs, which media elements treat
 *      as ordinary seekable resources. Posters are images and stay as data:
 *      URIs, which do work.
 *
 *   2. The bootstrap is a classic script, not a module. Classic scripts run at
 *      parse time and modules are deferred, so it is guaranteed to have set
 *      every `data-mp4` before the site's own code looks for one. That also
 *      means the hero stops being a special case: it loses its inline
 *      <source> elements and goes through the same lazy path as the rest.
 *
 * Both formats are carried, webm first. On a real wire the browser picks one;
 * here both ship regardless, which costs about 2 MB — but webm alone leaves
 * Safari and iOS looking at a poster, and mp4 alone leaves out any Chromium
 * built without proprietary codecs. A demo file that plays nowhere is worse
 * than a fat one.
 *
 *   npm run build && node scripts/inline.mjs   →  dist/standalone.html
 */

import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const PUB = 'public';

const b64 = (file) => fs.readFileSync(file).toString('base64');
const dataURI = (file, mime) => `data:${mime};base64,${b64(file)}`;

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// ── css, with the fonts folded into it ──────────────────────────────────────
const cssFile = html.match(/href="\/(assets\/[^"]+\.css)"/)[1];
const css = fs.readFileSync(path.join(DIST, cssFile), 'utf8')
  .replace(/url\(\/fonts\/([^)]+)\.woff2\)/g,
    (_, name) => `url(${dataURI(path.join(PUB, 'fonts', `${name}.woff2`), 'font/woff2')})`);

// ── js ──────────────────────────────────────────────────────────────────────
const jsFile = html.match(/src="\/(assets\/[^"]+\.js)"/)[1];
// A literal </script> anywhere in the bundle would close the tag early.
const js = fs.readFileSync(path.join(DIST, jsFile), 'utf8').replace(/<\/script/gi, '<\\/script');

// ── rewrite the markup ──────────────────────────────────────────────────────
const clips = new Set();
const claim = (name) => { clips.add(name); return name; };

html = html
  .replace(/\s*<link rel="preload"[^>]*>/g, '')
  .replace(/\s*<link rel="icon"[^>]*>/g, '')
  .replace(/\s*<link rel="stylesheet"[^>]*>/g, '')
  .replace(/\s*<script type="module"[^>]*><\/script>/g, '')
  // the hero's inline <source> list goes away; the bootstrap feeds it like the rest
  .replace(/\s*<source src="\/video\/([\w-]+)\.(webm|mp4)"[^>]*>/g, (_, n) => claim(n) && '')
  .replace(/ data-webm="\/video\/[^"]+"/g, '')
  .replace(/ data-mp4="\/video\/([\w-]+)\.mp4"/g, (_, n) => ` data-clip="${claim(n)}"`)
  .replace(/poster="\/video\/([\w-]+)\.jpg"/g,
    (_, n) => `poster="${dataURI(path.join(PUB, 'video', `${n}.jpg`), 'image/jpeg')}"`);

// the hero video had its sources stripped, so tag it by its poster's clip name
html = html.replace(/(<video class="plate" playsinline muted loop autoplay preload="metadata")/,
  '$1 data-clip="hero-curtain"');
clips.add('hero-curtain');

const payload = Object.fromEntries([...clips].map((n) => {
  const entry = { mp4: b64(path.join(PUB, 'video', `${n}.mp4`)) };
  const webm = path.join(PUB, 'video', `${n}.webm`);
  if (fs.existsSync(webm)) entry.webm = b64(webm);
  return [n, entry];
}));

const bootstrap = `
const clips = JSON.parse(document.getElementById('clips').textContent);
const blobURL = (raw, type) => {
  const bin = atob(raw);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type }));
};
for (const video of document.querySelectorAll('video[data-clip]')) {
  const clip = clips[video.dataset.clip];
  if (!clip) continue;
  if (clip.webm) video.dataset.webm = blobURL(clip.webm, 'video/webm');
  video.dataset.mp4 = blobURL(clip.mp4, 'video/mp4');
  video.removeAttribute('autoplay');   // the site's controller decides what runs
}
`.trim();

// The site's <title> is an SEO string; a single-file host uses it as the page's
// name in a tab or gallery, where the company name alone is what identifies it.
const title = 'ASD Climat';
const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>')).trim();

// ── the Artifact host supplies doctype/head/body, so emit page content only ──
const out = `<title>${title}</title>
<style>
${css}
</style>

${body}

<script type="application/json" id="clips">${JSON.stringify(payload)}</script>
<script>
${bootstrap}
</script>

<script type="module">
${js}
</script>
`;

const dest = path.join(DIST, 'standalone.html');
fs.writeFileSync(dest, out);
console.log(`${dest} — ${(Buffer.byteLength(out) / 1024 / 1024).toFixed(2)} MB, ${clips.size} clips`);
