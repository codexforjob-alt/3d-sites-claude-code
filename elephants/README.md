# MATRIARCH

Single-page site for a fictional elephant conservation collective. Built as a
design demonstration — the organisation, the named animals and the field notes
are invented; the population figures are not (see *Facts* below).

```bash
npm install
npm run dev      # http://localhost:5184
npm run build
```

Registered in the repo's `.claude/launch.json` as `elephants`.

## Stack

Vite 6 · React 19 · Tailwind 4 · GSAP + ScrollTrigger · Lenis. No image assets —
every visual is drawn in code, so the whole page ships as markup, CSS and one
canvas routine.

## Design system

Generated with the `ui-ux-pro-max` skill at variance 7 / motion 7 / density 4.

| | |
|---|---|
| Pattern | Immersive / Interactive Experience |
| Style | Biomimetic / Organic 2.0 |
| Type | Playfair Display (display) · Inter (body) · JetBrains Mono (labels) |
| Motion | Stagger List — `back.out(1.4)`, `stagger: { each: 0.06, grid: 'auto' }` |

**Colour is the one deliberate departure.** The skill's palette search returned
*compassion blue + action orange* for the non-profit product type and *editorial
black + pink* for the resolved style — both wrong for a dark, dusk-lit savanna.
The palette in `src/index.css` is hand-authored instead, and every pair was
checked against the WCAG 4.5:1 body-text threshold:

| Token | Hex | On `--color-night` |
|---|---|---|
| `--color-bone` | `#F2EDE4` | 17.3:1 |
| `--color-ash` | `#A89E8F` | 7.4:1 |
| `--color-ochre` | `#D0813F` | 7.0:1 |
| `--color-acacia` | `#8A9A72` | 8.1:1 |

`--color-dust` is decorative only and is never used for body copy.

> **Careful with `@theme`.** Custom properties named `--space-*` land in
> Tailwind's spacing namespace. Defining a density scale there silently rewrites
> every numeric spacing utility on the site (`px-6` resolved to `6rem`). The
> rhythm scale lives on plain `:root` as `--rhythm-*` for that reason.

## Hero

The scroll choreography is adapted from **[Hero Scrub](https://21st.dev/@jean.duthil13/components/hero-scrub)**
by @jean.duthil13, retrieved through the 21st.dev MCP: a tall section with an
inner sticky stage, a card that scales from thumbnail to overfilled viewport and
back, and the wordmark splitting apart as it goes.

Two departures from the original:

- The card renders a **procedural savanna** (`src/lib/savanna.js`) driven by
  scroll progress, rather than scrubbing a 300-frame image sequence. Zero bytes
  of frames to download, and the scrub can't stutter on an unloaded frame.
- `immerseScale()` measures the card's own layout box instead of assuming 16:9,
  because the card is 4:5 on mobile and 16:9 from `md` up.

## The elephant

One silhouette, authored once in `src/lib/elephant-path.js`, consumed twice:

- `components/Elephant.jsx` renders it as SVG, filled with `currentColor`
- `lib/savanna.js` builds `Path2D` objects from the same strings for the canvas

The herd cards size the animal by age, so the three-year-old calf reads as a
calf without ragging the grid.

## Accessibility

- `prefers-reduced-motion` collapses the hero to a single viewport, skips Lenis,
  freezes the canvas on a lit frame, and renders every counter at its final
  value. Verified under emulation: document height drops 9000px → 5740px and all
  25 reveal targets are visible on load.
- Focus rings are never removed; a skip link precedes the nav.
- All interactive targets are ≥44px; the mobile menu items are 48px.
- Nav toggle carries `aria-expanded` / `aria-controls` and closes on Escape.

## Facts

Population figures follow the IUCN Red List assessment that split Africa's
elephants into two species in 2021 — African forest elephant, Critically
Endangered, down more than 86% over 31 years; African savanna elephant,
Endangered, down at least 60% over 50 years. Everything else on the page —
MATRIARCH itself, the named animals, the field notes, the donation tiers — is
written for the demonstration. The donation form processes nothing and collects
nothing.
