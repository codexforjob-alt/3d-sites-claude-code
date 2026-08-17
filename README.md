# SILT

One-page site for a niche perfume house. Vite + React + GSAP ScrollTrigger.
Tailwind is used for text layout only.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Structure

```
src/
  App.jsx                    the five sections
  Reveals.jsx                GSAP: scroll reveals + hero parallax
  hooks/useMediaFlags.js     reduced-motion / mobile
  components/BgVideo.jsx     <video> with poster, solid fallback, lazy src
  sections/                  Hero, Philosophy, Notes, Composition, Contact
```

## Sections

Hero → philosophy → notes (top / heart / base) → composition → contact. One
scrolling page, five sections.

The hero is a full-bleed video frame under a vertical gradient, with the
wordmark set at `26vw` on phones and `15vw` above. Everything below sits on flat
`#0B0B0C` so the type carries the page.

## Video

Four clips in `/public/video/` — see the README there for names, fallback
colours and how to regenerate posters. All are `autoplay muted loop playsinline
preload="metadata"` with a `poster`, over a solid fill so a missing file cannot
break the page.

`autoplay` overrides `preload="metadata"` — browsers start fetching every
autoplaying clip on load, which for four 1080p files is tens of megabytes before
the visitor scrolls. `BgVideo` therefore withholds the `src` until an
`IntersectionObserver` says the element is close (one viewport of lead-in on
desktop, 25% on phones) and pauses playback once it scrolls away. At the top of
the page only the clips actually in play are fetched.

## Motion and performance

- `prefers-reduced-motion: reduce`: no `<video>` mounted at all, no network
  requests for the clips, no reveals, no parallax — posters only.
- Phones (`max-width: 768px` or a coarse pointer) get the hero poster frame
  instead of the 9 MB hero clip.
- Reveal start state lives behind a `.motion-ok` class set before first paint,
  so if the bundle never runs the page stays readable rather than stranded at
  `opacity: 0`.
- No WebGL anywhere; three.js and drei are not bundled.

## Palette and type

Only `#0B0B0C`, `#4A5240`, `#C9B89A`, `#8A5A2B`, `#EDE8E0`, defined as Tailwind
theme tokens (`ink`, `olive`, `sand`, `amber`, `cream`). Archivo throughout,
uppercase with wide tracking for headings.

## Unused dependencies

The 3D bottle was removed, so `three`, `@react-three/fiber` and
`@react-three/drei` are no longer imported and no longer end up in the bundle.
They are still listed in `package.json`; drop them with:

```bash
npm uninstall three @react-three/fiber @react-three/drei
```
