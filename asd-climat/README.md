# ASD Climat

One-page site for a climate-systems contractor in Almaty, pitched at commercial
work: multi-zone VRF and mechanical ventilation with heat recovery. Vite,
vanilla ES modules, GSAP + ScrollTrigger for reveals, Lenis for smooth scroll.
No framework.

**This ships as a demo.** See [Demo mode](#demo-mode) before doing anything with it.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the build on :4173

npm run verify     # headless Chromium: contrast, overflow, touch targets,
                   # headline line counts, lazy-load, motion toggle, reduced
                   # motion (needs a preview server on :4177)
npm run shots      # section screenshots at 1440 and 390 into .verify/
node scripts/inline.mjs   # → dist/standalone.html, one self-contained file
```

## Demo mode

The page carries the company's real name, phone number and email, and **every
price and statistic on it is invented**. That is fine as a mock-up and dangerous
the moment somebody takes it for the live site and rings the number quoting a
figure off it. So the demo build:

- shows a fixed banner at the top of every screen saying the numbers are notional
- labels the ledger tables and the estimator output as demonstration figures
- **disables every route to the company.** The phone, WhatsApp, email and
  Instagram links have their `href` stripped at boot; clicking one explains why
  instead of dialling. The number stays legible — it is the client's own and it
  is public — but nothing on this page will reach them.
- carries `<meta name="robots" content="noindex, nofollow">`

**One switch: the `<p class="demo">` element in `index.html`.** Delete it and the
site is live — `src/js/demo.js` keys off its presence and nothing else, so every
link starts working again. Also drop the `robots` meta, the "Цены демонстрационные"
lines in the two table captions, and the demo sentence under the estimator.

`src/js/estimate.js` checks `isDemo()` separately, because it rewrites the dock's
link on every recalculation — long after `initDemo()` has run once.

## The page

Ledger-shaped, not a showreel. A commercial buyer is comparing numbers and
timelines, so the spine is two price tables, an honest argument about when VRF
is *not* worth it, and a working estimator. Video is the breath between blocks;
no copy sits over video except in the closing block.

```
hero        VRF thesis + price-from + request-survey
vrf         when VRF beats separate splits (both columns argued), price table,
            indoor-unit surcharges, what is charged separately
vent        air handling with heat recovery, price table, why recovery pays
estimate    five questions → an order of magnitude → a WhatsApp message
project     seven stages with real durations, two square plates inline
band        full-bleed outdoor plate
service     maintenance contract, warranty, service area, residential splits
rules       six things the company refuses to do
facts       eight figures
contact     closing plate with the headline on its clean left half
```

The estimator is the one thing that does work rather than decorate, so it is the
only place spending any boldness. Once touched, the figure follows you down the
page in a dock and composes a WhatsApp message with your configuration — in the
live build. The dock stands down while the calculator is on screen and again at
the closing block.

`src/js/estimate.js` holds the price table. **It is the same arithmetic as the
two HTML tables** — change `PRICES` and the tables in `index.html` together, or
the page will quote two different numbers for the same job. The object-type
question is not decorative: it scales the ventilation line only, because a
restaurant needs far more air changes than an office of the same floor area.

## Plates

Five clips in `public/video`, each as `.mp4`, `.webm` and a `.jpg` poster.
2.1 MB total over the wire; the first screen costs 480 KB because everything
below the fold has no `src` until it is 400 px from the viewport.

| File | Ratio | Where |
|---|---|---|
| `hero-curtain` | 9:16 | hero column; 4:5 on phones |
| `plate-copper` | 1:1 | project step 4, refrigerant mains |
| `plate-vacuum` | 1:1 | project step 5, evacuation |
| `plate-outdoor` | 16:9 | full-bleed band |
| `cta-room` | 16:9 | closing block, behind a gradient scrim |

### Two of them were reframed, and why

- **`plate-copper`** came back with **`ARRI` legibly printed on the installer's
  glove** — Veo lifted the brand out of the "Shot on ARRI Alexa 35" clause in the
  prompt and stamped it on the fabric. A frame-by-frame contact sheet showed the
  glove in shot for seven of the eight seconds, so there was nothing to trim; it
  is cropped to the left 720×720 square, which excludes it entirely. **If you
  regenerate it, do not name a camera brand in the prompt** — say "a large-format
  cinema camera with a 100 mm macro probe lens" instead.
- **`plate-vacuum`** came back as a pressure gauge with invented dial numbers
  (`96`, `18`, `10`) rather than the plain oil sight glass the prompt asked for.
  Cropped 720×720 from x=300, pushing the worst of the dial out of frame.

All five were rebuilt as seamless loops: Veo's first and last frames do not
match, so each clip crossfades its final second into its own opening second.
That is why they are 7.0 s rather than 8.0 s.

### Two plates no longer match the subject

The footage was generated for a residential split-system page. After the pivot to
commercial VRF and ventilation, two clips are carrying captions that work harder
than the images do:

- **`cta-room`** is a domestic living room — linen sofa, herringbone oak. On a
  page selling systems for offices and restaurants it is the weakest thing here.
  It wants an open-plan office or a restaurant floor at end of service.
- **`plate-outdoor`** is a single domestic condensing unit on a rendered facade.
  A VRF outdoor is a modular rack on a roof or a plant deck, and the caption is
  doing the reconciling.

Replacement prompts are in `PLATES.md`. Everything else adapts: the curtain reads
as supply air rather than a bedroom breeze, and copper and vacuum work harder on
a VRF page than they did on a residential one.

### Known artefact left in

`plate-outdoor` has a small illegible three-character mark on the side of the
unit. It reads as a weathered sticker rather than a brand, and cropping it out
would mean cropping the unit out of its own shot.

### Replacing a plate

```bash
python3 .claude/skills/cinematic-video-site/scripts/encode_plates.py \
  --src <folder> --out asd-climat/public/video --map asd-climat/plates.map.json
```

Writes mp4 + webm + poster per clip and deletes any webm bigger than its mp4 —
`<source>` lists webm first, so a heavier webm would be the file every browser
downloads. Build the seamless loop before encoding:

```bash
ffmpeg -i in.mp4 -an -filter_complex \
  "[0:v]split[x][y];[x]trim=0:7,setpts=PTS-STARTPTS[body];\
   [y]trim=7:8,setpts=PTS-STARTPTS[tail];\
   [tail][body]xfade=transition=fade:duration=1:offset=0[v]" \
  -map "[v]" -c:v libx264 -crf 16 out.mp4
```

## Single-file build

`node scripts/inline.mjs` folds CSS, JS, fonts, posters and both video formats
into `dist/standalone.html` (~7.8 MB) for hosts that take one file. Two things
there are not obvious and are documented in the script: **video cannot be a
`data:` URI** (Chromium answers a megabyte-scale `data:video/mp4` with
networkState 3 and no error object, so the clips become blob: URLs at runtime),
and both formats have to travel — webm alone leaves Safari on a poster, mp4
alone leaves out Chromium builds without proprietary codecs.

It is a way to show the site, not to serve it: every byte loads up front, where
the real build costs 480 KB for the first screen.

## Re-skinning

Everything is in `src/css/tokens.css`. The palette was sampled out of the five
poster frames rather than chosen: all five sit at 45–56 fifth-percentile
luminance (there is no black anywhere in this footage) with one saturated note at
hue 30–40 — copper, brass, pump oil and Almaty sunlight. Hence a bone ground and
a single copper accent. **On a dark ground these plates go grey and flat**, so
swapping `--paper` for something dark means recutting the footage too.

- `--paper` / `--paper-2` / `--paper-3` — grounds
- `--ink` / `--ink-2` / `--ink-3` — text tiers. `--ink-3` is exactly 4.7:1 on
  `--paper`; it fails WCAG AA if you lighten it at all.
- `--copper` — the one accent. `--copper-hi` is for fills and large numerals only
  (and the demo banner); it does not pass as body text.
- `--cold` — hairlines and captions, from the curtain's shadow side.
- `--demo-h` — height of the demo banner. The fixed header and the hero both
  offset by it, so it must match what the banner actually renders at.

Fonts are self-hosted in `public/fonts` (Golos Text, JetBrains Mono — both
variable, cyrillic + latin subsets, four files). No third-party request in the
critical path.

## Breakpoints and behaviour

- **≥ 900 px** — hero is two columns; project steps put their plate in a third
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

Real, from the company's own profile:

- Name, city, "с 2010 года"
- Phone `8 778 824 22 22`, `zakaz@asd-climat.kz`, Instagram `@asd_climate_almaty`
- That they sell and install climate equipment in Almaty

**Everything below is invented.** It is plausible for Almaty in 2026 and
internally consistent, and it is still made up. Nothing here came from the
client.

- **That the company does VRF and mechanical ventilation at all.** The public
  profile only says air conditioners — sales, installation, service. The entire
  commercial positioning of this page is a proposal, not a fact. Confirm it
  before anyone sees this.
- **All prices**: the VRF table (4,9–46,5 млн ₸), indoor-unit surcharges,
  the ventilation table (3,2–21,4 млн ₸), design at 1 200 ₸/м², BMS from
  900 000 ₸, fire dampers, the service table, the 45 000 ₸/мес contract, and
  every figure in `PRICES` in `src/js/estimate.js`.
- **Technical claims**: recovery efficiency 78–82 %, the ×1,25 restaurant and
  ×1,15 clinic air-change coefficients, "60–70 % суммы" on electrical
  diversity, "отбивает за 4–6 лет", "40 кВт тепла", the 6–12 hour evacuation.
- **Company scale**: own design department, 2 designers, 4 crews.
- **The figures block**: 47 VRF sites, 1 180 indoor units, 63 air handling
  units, largest site 2 400 m², 212 sites under contract, 4-hour emergency
  response.
- **Timings** in the project sequence, and the 3–5 month total.
- **The refusals list**, including "не менялся с 2014 года".
- **Client references**: a floor of a business centre on al-Farabi, two server
  rooms, a pharmacy chain, four coffee shops, a 180-seat restaurant.
- **Warranty terms**: 3 years on installation, 1 year on commissioning.
- **Hero caption**: the 0,2 m/s grille velocity.
- The residential figure "от 163 000 ₸" carried over from the earlier version.

There is deliberately **no street address**. The company's public profile does
not state one, and a plausible-looking invented address would send customers to
a stranger's door.
