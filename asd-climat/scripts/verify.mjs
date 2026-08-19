import { chromium } from 'playwright';
import fs from 'node:fs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const URL = 'http://localhost:4177/';
const OUT = './.verify/shots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: EXE });

const probe = `(() => {
  const chan = (c) => {
    const n = (c.match(/-?[\\d.]+/g) || ['0','0','0']).map(Number);
    const srgb = c.startsWith('color(');           // color(srgb 0.9 0.9 0.9 / 0.88)
    return { rgb: n.slice(0, 3).map(v => srgb ? v * 255 : v), a: n.length > 3 ? n[3] : 1 };
  };
  const lum = (c) => {
    const [r,g,b] = chan(c).rgb.map(v => {
      v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    });
    return 0.2126*r + 0.7152*g + 0.0722*b;
  };
  const groundOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg !== 'transparent' && chan(bg).a > 0.85) return bg;
      n = n.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  };
  const ratio = (a, b) => { const [x,y] = [lum(a), lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

  // contrast for every element holding real text
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
    const txt = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
    if (!txt) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const r = ratio(cs.color, groundOf(el));
    const need = large ? 3 : 4.5;
    if (r < need) bad.push({ tag: el.tagName + '.' + (el.className||'').toString().split(' ')[0], size, r: +r.toFixed(2), need, txt: txt.slice(0,42) });
  }

  // horizontal overflow
  const vw = document.documentElement.clientWidth;
  const over = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      let clipped = false, n = el.parentElement;
      while (n) { const o = getComputedStyle(n).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break; } n = n.parentElement; }
      if (!clipped) over.push({ tag: el.tagName + '.' + (el.className||'').toString().split(' ')[0], left: Math.round(r.left), right: Math.round(r.right), vw });
    }
  }

  // touch targets for interactive things
  const small = [];
  for (const el of document.querySelectorAll('a, button, .opts span')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || el.classList.contains('skip')) continue;
    if (r.height < 44 && getComputedStyle(el).display !== 'inline') small.push({ tag: el.tagName + '.' + (el.className||'').toString().split(' ')[0], h: Math.round(r.height), txt: (el.textContent||'').trim().slice(0,26) });
  }

  // headline fit
  // Wrapping does not grow scrollWidth, so measure line boxes: a headline with
  // explicit <br>s must render exactly that many lines and no more.
  const lineCount = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const tops = new Set([...r.getClientRects()].filter(x => x.height > 4).map(x => Math.round(x.top)));
    return tops.size;
  };
  const heads = [...document.querySelectorAll('h1, h2, h3')].map(h => ({
    txt: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 34),
    want: h.querySelectorAll('br').length + 1,
    got: lineCount(h),
    over: h.scrollWidth > h.clientWidth + 1,
  })).filter(h => h.over || (h.querySelectorAll ? false : false) || h.got > h.want && h.want > 1);

  return {
    scrollW: document.documentElement.scrollWidth, vw,
    hydrated: [...document.querySelectorAll('video')].map(v => ({ id: (v.getAttribute('poster')||'').split('/').pop().replace('.jpg',''), got: (v.currentSrc||'—').split('/').pop(), playing: !v.paused, w: v.videoWidth })),
    bad, over, small, heads,
  };
})()`;

async function run(label, width, height, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: 1,
    reducedMotion: opts.reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('requestfailed', r => failed.push(r.url() + ' — ' + (r.failure()?.errorText)));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const first = await page.evaluate(probe);
  console.log(`\n════ ${label} (${width}×${height})${opts.reduced ? ' · reduced-motion' : ''}`);
  console.log('  scrollWidth', first.scrollW, 'vs viewport', first.vw);
  console.log('  videos hydrated at first paint:', JSON.stringify(first.hydrated));
  if (first.heads.length) console.log('  HEADLINE OVERFLOW:', JSON.stringify(first.heads));
  if (first.over.length) console.log('  OVERFLOWS:', JSON.stringify(first.over.slice(0, 8), null, 1));
  if (first.small.length) console.log('  SMALL TARGETS:', JSON.stringify(first.small.slice(0, 8)));
  if (first.bad.length) console.log('  CONTRAST FAILS:', JSON.stringify(first.bad.slice(0, 14), null, 1));

  // scroll the whole page, then re-probe
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  });
  await page.waitForTimeout(1200);
  const after = await page.evaluate(probe);
  console.log('  after full scroll → videos:', JSON.stringify(after.hydrated));
  if (after.over.length) console.log('  OVERFLOW after scroll:', JSON.stringify(after.over.slice(0, 6)));
  if (after.bad.length) console.log('  CONTRAST after scroll:', JSON.stringify(after.bad.slice(0, 10), null, 1));

  // motion toggle
  const toggle = await page.$('.motion');
  if (toggle) {
    const before = await page.evaluate(() => [...document.querySelectorAll('video')].filter(v => !v.paused).length);
    await toggle.click();
    await page.waitForTimeout(400);
    const mid = await page.evaluate(() => [...document.querySelectorAll('video')].filter(v => !v.paused).length);
    await toggle.click();
    await page.waitForTimeout(600);
    const back = await page.evaluate(() => [...document.querySelectorAll('video')].filter(v => !v.paused).length);
    console.log(`  motion toggle: playing ${before} → ${mid} → ${back}`);
  } else console.log('  motion toggle: MISSING');

  // reveal resting states
  const stuck = await page.evaluate(() => [...document.querySelectorAll('.rise')]
    .filter(el => el.getBoundingClientRect().top < innerHeight && +getComputedStyle(el).opacity < 0.95).length);
  console.log('  elements stuck invisible:', stuck);

  if (errors.length) console.log('  CONSOLE ERRORS:', errors.slice(0, 5));
  if (failed.length) console.log('  FAILED REQUESTS:', failed.slice(0, 5));

  if (opts.shots) {
    await page.evaluate(() => { window.getSelection().removeAllRanges(); window.scrollTo(0, 0); });
    await page.waitForTimeout(600);
    for (const [i, sel] of ['.hero', '#equipment', '.band', '#install', '#service', '#rules', '#facts', '#estimate', '#contact'].entries()) {
      const el = await page.$(sel);
      if (!el) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await el.screenshot({ path: `${OUT}/${label}-${i}-${sel.replace(/[.#]/g, '')}.png` }).catch(() => {});
    }
  }
  await ctx.close();
}

await run('desktop', 1440, 900, { shots: true });
await run('laptop', 1024, 800);
await run('tablet', 768, 900);
await run('mobile', 390, 844, { shots: true });
await run('reduced', 1440, 900, { reduced: true });
await browser.close();
