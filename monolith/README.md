# Monolith — film studio landing page

A single-page, video-driven site for a small film studio. Dark, typographic,
scroll-choreographed. Ten 8-second plates carry the whole page; there are no
stock illustrations and no icon set to license.

## Running it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` writes a static `dist/` — drop it on any host. No server, no
database, no environment variables.

## Stack

| | |
|---|---|
| Build | Vite 7, vanilla ES modules |
| Scroll | Lenis, driven by GSAP's ticker (one rAF loop) |
| Animation | GSAP 3 + ScrollTrigger |
| Hero shader | Three.js, loaded as a separate chunk, desktop only |
| Fonts | Archivo (variable width), Instrument Sans, Martian Mono — Google Fonts |

No framework, no CSS preprocessor, no component library. Everything is plain
HTML, CSS custom properties, and ES modules.

**Bundle:** 144 kB main (54 kB gzip). Three.js is a further 506 kB that only
downloads above 900 px — phones fall back to the plain `<video>`, which looks
the same at rest.

## The design

The palette is sampled from the footage rather than picked from a system: every
clip is one warm light source carving a subject out of near-black. So the page
is `#08070A` ground, ivory text, and exactly one accent — molten gold. The cold
slate only ever appears in hairlines and shadows.

Two things are deliberate and worth keeping if you re-skin it:

**The timecode rail.** Ten clips at eight seconds is eighty seconds of runtime.
The left rail reads out real timecode against that runtime, and scroll position
is the playhead. It is a structure that tells the truth about the content, not
decoration — if you change the number of clips, update `RUNTIME` in
`src/js/timecode.js`.

**The anamorphic desqueeze.** Archivo's width axis runs 62–125. The hero and the
closing headline open from a squeeze to full width, which is what an anamorphic
lens does on projection. It is the one liberty the design takes; everything
around it is kept quiet on purpose.

## Swapping the videos

Plates live in `public/video/`. Each one is three files:

```
name.webm   served first
name.mp4    fallback
name.jpg    poster, shown until the clip is decoded
```

Replace the files, keep the names, and nothing else needs to change. The
`<source>` tags in `index.html` point at `data-src`, not `src` — that is what
makes them lazy, so do not "fix" it.

| File | Where it appears | Ratio |
|---|---|---|
| `hero-loop` | Hero, full bleed | 16:9 |
| `reel-studio` | Pinned manifesto plate | 16:9 |
| `case-01-fashion` | Work card 1 | 9:16 |
| `case-02-architecture` | Work card 2 | 9:16 |
| `case-03-automotive` | Work card 3 | 9:16 |
| `transition-ink` | Wipe between Work and Studio | 16:9 |
| `texture-grain` | Global grain overlay | 16:9 |
| `about-portrait` | Studio section | 16:9 |
| `cta-horizon` | Contact, full bleed | 16:9 |
| `loader-shimmer` | Preloader | 16:9 |

Encoding used here, for reference:

```bash
ffmpeg -i in.mp4 -an -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 25 -preset slow -movflags +faststart -g 48 out.mp4
```

Check that each `.webm` is actually smaller than its `.mp4` before shipping it.
On grainy or high-frequency footage VP9 loses to x264, and the browser will
happily download the bigger file because it is listed first. Delete any `.webm`
that loses and the `<source>` falls through on its own.

## Re-skinning

Nearly everything is a custom property in `src/styles/tokens.css` — palette,
type scale, spacing, the width-axis endpoints, the rail width, easings. Change
the studio name in `index.html` (it appears in the header, the preloader, the
footer, and `<title>`) and the palette in tokens, and the site is rebranded.

## Behaviour worth knowing

- **Below 900 px** the horizontal Work reel becomes a vertical stack, the
  timecode rail is hidden, WebGL never loads, and the grain overlay is skipped.
  Pinned horizontal scroll on touch is hostile, so it is not shipped there.
- **`prefers-reduced-motion`** disables Lenis, the shader, the grain, the custom
  cursor, and every transition, and the plates stay on their poster frames.
  Headlines render at their final width because the CSS resting state is the
  finished state — the animation only ever runs *from* the squeeze.
- **The motion toggle in the header** pauses or resumes every plate at once.
  The plates loop indefinitely, and WCAG 2.2.2 asks for a way to stop anything
  that plays by itself for longer than five seconds — honouring the OS setting
  only covers the people who have found it. The toggle also lets a
  reduced-motion visitor opt back *in*, which is friendlier than deciding for
  them. All video state goes through `src/js/plates.js`; if you add a plate,
  register it there rather than calling `.play()` on it.
- **No JavaScript** still renders a readable page; a `<noscript>` block drops the
  preloader and unlocks scrolling.
- **Scroll restoration is manual.** A reload halfway down would otherwise play
  the preloader and then drop the visitor into the middle of the reel.
- **Videos pause off-screen.** An off-screen `<video>` that is still playing
  costs the same CPU as one you can see; with ten plates that matters.

## Accessibility

All text meets WCAG AA against the page ground (`--smoke`, the muted label
colour, is the floor at 5.6:1). Focus rings are visible, touch targets are at
least 44 px, the looping plates can be stopped from the header (WCAG 2.2.2),
and the decorative plates are `aria-hidden`. The ticker in the Studio section is
intentionally near-invisible texture and is hidden from assistive tech.

## Content

All copy, client names, and credits in this page are placeholder. Sable, Béton
Civic, Kestrel Motors and Ilse Warmer are invented; replace them before the site
goes live.
