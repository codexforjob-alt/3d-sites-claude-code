import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = './.verify/view';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [label, w, h] of [['d', 1440, 900], ['m', 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4177/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const secs = ['.hero', '#equipment', '.band', '#install', '#service', '#rules', '#facts', '#estimate', '#contact'];
  for (const [i, sel] of secs.entries()) {
    await p.evaluate((s) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 58); }, sel);
    await p.waitForTimeout(700);
    await p.evaluate(() => getSelection().removeAllRanges());
    await p.screenshot({ path: `${OUT}/${label}${i}${sel.replace(/[.#]/g, '')}.png` });
  }
  // dock state check + a shot with the calculator touched
  console.log(label, 'dock hidden before touch:', await p.evaluate(() => document.getElementById('dock').hidden));
  await p.evaluate(() => { const el = document.querySelector('input[name="area"][value="35"]'); el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.evaluate(() => { const el = document.querySelector('input[name="wall"][value="concrete"]'); el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.evaluate(() => { const el = document.querySelector('input[name="route"][value="7"]'); el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForTimeout(900);
  console.log(label, 'total:', await p.evaluate(() => document.getElementById('total').textContent));
  console.log(label, 'wa link:', decodeURIComponent(await p.evaluate(() => document.getElementById('dockGo').href)).slice(0, 220));
  await p.evaluate(() => document.querySelector('#estimate').scrollIntoView());
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/${label}9calc.png` });
  await ctx.close();
}
await b.close();
