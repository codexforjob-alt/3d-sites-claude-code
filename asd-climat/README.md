# ASD Climat

One-page site for a climate-equipment company in Almaty. Vite, vanilla ES modules,
GSAP + ScrollTrigger for reveals, Lenis for smooth scroll. No framework.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the build on :4173

npm run verify     # headless Chromium pass: contrast, overflow, touch targets,
                   # lazy-load, motion toggle, reduced motion (needs a preview
                   # server on :4177 — see scripts/verify.mjs)
npm run shots      # section screenshots at 1440 and 390 into .verify/
```

## The page

Ledger-shaped, not a showreel. Someone buying an air conditioner in Almaty is
comparing numbers — how much, for what room, how soon, what warranty — so the
spine of the page is two price tables and a working estimator. Video is the
breath between blocks; there is deliberately no copy set over video except in
the closing block.

```
hero            headline + price-from + WhatsApp, vertical plate beside it
equipment       price table by unit size, what's included / what's extra
estimate        five questions → a real total → a pre-filled WhatsApp message
install         five steps with hours and money, two square plates inline
service         maintenance prices, warranty, service area
band            full-bleed outdoor plate
rules           five things the company refuses to do
facts           eight figures
contact         closing plate with the headline on its clean left half
```

The estimator is the one thing on the page that does work rather than decorate,
so it is also the only place that spends any boldness. Once you touch it, the
total follows you down the page in a dock and composes a WhatsApp message
containing your configuration. The dock stands down while the calculator itself
is on screen (it used to cover the last question) and again at the closing
block, where the same button is already present.

`src/js/estimate.js` holds the price table. **It is the same arithmetic as the
two HTML tables** — change `PRICES` and the tables in `index.html` together, or
the page will quote two different numbers for the same job.

## Plates

Five clips in `public/video`, each as `.mp4`, `.webm` and a `.jpg` poster.
2.1 MB total over the wire; the first screen costs 420 KB (hero webm) because
everything below the fold has no `src` until it is 400 px from the viewport.

| File | Ratio | Where |
|---|---|---|
| `hero-curtain` | 9:16 | hero column; 4:5 on phones |
| `plate-copper` | 1:1 | install step 2 |
| `plate-vacuum` | 1:1 | install step 4 |
| `plate-outdoor` | 16:9 | full-bleed band |
| `cta-room` | 16:9 | closing block, behind a gradient scrim |

### Two of them were reframed, and why

- **`plate-copper`** came back with **`ARRI` legibly printed on the installer's
  glove** — Veo lifted the brand out of the "Shot on ARRI Alexa 35" clause in
  the prompt and stamped it on the fabric. The glove is in frame for roughly
  seven of the eight seconds, so there was nothing to trim; it is cropped to the
  left 720×720 square, which excludes the glove entirely. That is why it is a
  square detail beside a step rather than the full-bleed band it was written
  for. **If you regenerate it, do not name a camera brand in the prompt** — say
  "a large-format cinema camera with a 100 mm macro probe lens" instead.
- **`plate-vacuum`** came back as a pressure gauge with invented numbers on the
  dial (`96`, `18`, `10`) rather than the plain oil sight glass the prompt asked
  for. Cropped 720×720 from x=300, which pushes the worst of the dial out of
  frame and keeps the oil, the bubbles and the frosted housing.

All five were also rebuilt as seamless loops: Veo's first and last frames do not
match, so each clip crossfades its final second into its own opening second.
That is why they are 7.0 s rather than 8.0 s.

### Known artefact left in

`plate-outdoor` has a small illegible three-character mark on the side of the
condensing unit. It reads as a weathered sticker rather than a brand, and
cropping it out would mean cropping the unit out of its own shot. Left as is —
regenerate with "no model badges, no stickers, no markings on the housing" if it
bothers you.

### Replacing a plate

Drop the new clip into a folder, name it after the target, and run the encoder
from the skill:

```bash
python3 .claude/skills/cinematic-video-site/scripts/encode_plates.py \
  --src <folder> --out asd-climat/public/video --map asd-climat/plates.map.json
```

It writes mp4 + webm + poster per clip and deletes any webm that came out bigger
than its mp4 — `<source>` lists webm first, so a heavier webm would be the file
every browser downloaded.

Loops were built before encoding, with:

```bash
ffmpeg -i in.mp4 -an -filter_complex \
  "[0:v]split[x][y];[x]trim=0:7,setpts=PTS-STARTPTS[body];\
   [y]trim=7:8,setpts=PTS-STARTPTS[tail];\
   [tail][body]xfade=transition=fade:duration=1:offset=0[v]" \
  -map "[v]" -c:v libx264 -crf 16 out.mp4
```

## Re-skinning

Everything is in `src/css/tokens.css`. The palette was sampled out of the five
poster frames rather than chosen: all five plates sit at 45–56 fifth-percentile
luminance (there is no black anywhere in this footage) with one saturated note
at hue 30–40 — copper, brass, pump oil and Almaty sunlight. Hence a bone ground
and a single copper accent. **On a dark ground these plates go grey and flat**,
so swapping `--paper` for something dark means recutting the footage too.

- `--paper` / `--paper-2` / `--paper-3` — grounds
- `--ink` / `--ink-2` / `--ink-3` — text tiers. `--ink-3` is exactly at 4.7:1 on
  `--paper`; it fails WCAG AA if you lighten it at all.
- `--copper` — the one accent. `--copper-hi` is for fills and large numerals
  only; it does not pass as body text.
- `--cold` — hairlines and captions, sampled from the curtain's shadow side.

Fonts are self-hosted in `public/fonts` (Golos Text, JetBrains Mono — both
variable, cyrillic + latin subsets, four files). No third-party request in the
critical path. To regenerate, fetch the Google Fonts CSS with a browser
user-agent and pull the `cyrillic` and `latin` faces; Google serves one variable
file per subset for every weight, so it is four files rather than twelve.

## Breakpoints and behaviour

- **≥ 900 px** — hero is two columns; install steps put their plate in a third
  column
- **900–620 px** — hero stacks, plates drop under their step
- **≤ 620 px** — steps go single-column, timing above the heading
- **≤ 860 px** — header nav hides; phone and motion toggle remain
- Price tables scroll horizontally inside their own container rather than
  widening the page
- **Reduced motion** — no plate is fetched at all (saves ~1.7 MB), nothing
  animates, every reveal rests at its finished state, and the motion toggle
  defaults to off but stays available so those visitors can opt back in
- **Motion toggle** in the header is the WCAG 2.2.2 mechanism: the plates loop
  indefinitely, so there has to be a stop. Every video goes through the one
  controller in `src/js/plates.js`, hero included, and the choice persists in
  `localStorage`.

## Everything on this page that is invented

The site is built for a real company, but only the contact details below came
from the business. **Everything else is placeholder and must be checked with the
client before this goes live.**

Real, taken from the company's own profile:

- Name, city, "с 2010 года"
- Phone `8 778 824 22 22` (and the `wa.me/77788242222` links)
- `zakaz@asd-climat.kz`
- Instagram `@asd_climate_almaty`
- The brands ALMACOM, LG, GREE, OTEX, and dealer status with ALMACOM

Invented — every number below:

- **All prices.** The equipment table (163 000–559 000 ₸), the extras
  (7 000 ₸/m trace, 4 500 / 7 000 ₸/m chasing, 25 000 ₸ rope access,
  20 000 ₸ removal, 6 000 ₸ out-of-town call-out), the whole service table
  (18 000 / 32 000 / 14 000 / 15 000 / 20 000 ₸) and every figure inside
  `PRICES` in `src/js/estimate.js`. They are plausible for Almaty in 2026 and
  internally consistent, and they are still made up.
- **"Цена действует до 30 сентября 2026 года"** under the estimator.
- **Company scale**: 4 crews, 9 installers, own warehouse.
- **The figures block**: 806 installs in 2025, 11 units in a day, 34 % repeat
  customers, 212 sites under service contract, 1-day and 2-day lead times.
- **Warranty terms**: 3 years on installation, free warranty call-out.
- **Timings** in the install steps (30 min / 2–4 h / 1 h / 40 min / 20 min) and
  the "40 minutes on the vacuum pump" claim the page argues from.
- **The refusals list**, including "не менялся с 2014 года".
- **Client references**: offices on Rozybakiev, two server rooms, a pharmacy
  chain, four coffee shops.
- **Service area** wording: Talgar, Kaskelen, Otegen-Batyr, Boraldai.
- **The hero caption**: "Квартира на Абая, 14 этаж".
- Model naming in the table is by capacity (07/09/12/18/24), not by SKU — no
  specific model numbers are claimed.

There is deliberately **no street address** on the page. The company's public
profile does not state one, and a plausible-looking invented address would send
customers to a stranger's door. Add the real one to the footer before launch.
