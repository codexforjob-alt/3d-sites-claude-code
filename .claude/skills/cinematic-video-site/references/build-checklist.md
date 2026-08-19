# Verification pass

Every defect below has actually shipped on a site like this. They cluster because
video-driven, scroll-choreographed pages fail in characteristic ways. Work through the list
in a real browser and measure rather than eyeball — several of these look fine in a
screenshot and are broken for the visitor.

## Recurring defect classes

### The preloader that never lifts

A preloader gated on a `requestAnimationFrame` counter hangs forever in a background tab,
because rAF is frozen there. The visitor opens your link in a new tab, switches to it a
minute later, and finds a black screen.

Always give an animated gate a timer backstop that resolves regardless. Same reasoning
applies to anything awaiting `canplay` on a video — add a cap so a failed decode does not
strand the page.

Test: load the page and check that the preloader clears even when the tab was never
composited.

### Reduced-motion states frozen mid-animation

When a property's *resting* value is only ever set by JavaScript animation, disabling that
animation leaves the element stuck at its start value. A headline that animates from a
condensed width to full width will stay condensed forever under `prefers-reduced-motion`.

Make the CSS resting state the *finished* state, and animate *from* the start value. Then
the element is correct when the animation is skipped, when the bundle fails, and when JS is
off entirely.

Test: override `matchMedia` via an init script and confirm every animated property landed on
its final value.

### Pinned sections are transparent

GSAP pinning switches the element to `position: fixed`. If the section has no background,
the sections still scrolling behind it bleed straight through, and you get ghost text
drifting across your layout.

Give every pinned section an opaque ground.

### Scaled elements open a horizontal scrollbar

A plate scrubbed from `scale: 1.28` overflows its container by a couple of hundred pixels
and the whole page gains horizontal scroll. `overflow-x: clip` on `body` alone does **not**
reliably propagate to the viewport — set it on `html` as well, and clip the offending
section directly.

Use `overflow: clip` rather than `hidden` around a `position: sticky` child: `hidden` makes
the parent a scroll container and the stick stops resolving against the viewport.

Test programmatically, because a scrollbar is easy to miss in a screenshot:

```js
window.scrollTo(600, 0); const overflows = window.scrollX > 0; window.scrollTo(0, 0);
```

Then walk the DOM for elements whose `right` exceeds the viewport and that have no clipping
ancestor — that finds the culprit rather than just proving one exists.

### Muted colour tokens fail contrast

A dark palette's third tier — the muted label colour — is the one that fails. It looks
tasteful and lands around 3.5:1. Fix the token rather than the usages; every place that
reads it improves at once.

Compute the ratios in the page against the actual ground colour instead of trusting a swatch.
Decorative near-invisible text (a ticker used as texture) is fine at any ratio provided it is
`aria-hidden` and carries no information.

### Text over video that only sometimes works

A veil gradient tuned against a plate's *average* brightness fails against its brightest
patch, and video is not static. Tune veils against the lightest frame the clip reaches.
Dawn, haze, and white backgrounds need far heavier veiling than they look like they do.

For the same reason, avoid `mix-blend-mode: difference` on a header sitting over video: over
a mid-grey frame the text renders mid-grey and vanishes. A gradient scrim costs one line and
never fails.

### Headlines that wrap and break their own reveal

A masked line reveal clips per line box. When a line wraps, the mask reveals two lines as one
block and the choreography falls apart, quite apart from the ugly break.

Set `white-space: nowrap` on display headlines and size the clamp so the longest line clears
the gutter at every breakpoint. Verify by measuring `scrollWidth` against the container, not
by looking.

### Scroll restoration drops visitors mid-page

Browsers restore scroll position on reload. With a preloader, that means the curtain plays
and then dumps the visitor into the middle of the page. Set
`history.scrollRestoration = 'manual'` and scroll to zero on boot.

### Looping plates with no way to stop them

This one is easy to miss because the page looks finished. WCAG 2.2.2 asks for a mechanism to
pause, stop, or hide anything that starts automatically, moves, and lasts longer than five
seconds. Plates that loop forever are exactly that, and honouring `prefers-reduced-motion`
only helps the people who have already found that setting.

Ship a visible motion toggle. Route every plate through one controller rather than calling
`.play()` in scattered places, so the toggle actually reaches all of them — including the
hero, which usually autoplays outside the lazy-load observers and gets forgotten.

Default it to off under reduced motion, but leave the control available so those visitors can
opt back *in* rather than having the decision made for them.

Test: count `document.querySelectorAll('video')` that are unpaused before and after clicking
the toggle. Before must be zero under a reduced-motion override.

### Everything decodes at once

Ten plates playing simultaneously will melt a laptop fan. An off-screen `<video>` that is
still playing costs the same as one you can see.

Lazy-load via `data-src` on `<source>` with an `IntersectionObserver`, and pause on exit with
a second, tighter observer. Verify by checking which videos have actually hydrated at first
paint — only the hero and any always-visible overlay should have.

### Heavy libraries shipped to devices that never use them

If a 3D shader is desktop-only, a static import still sends ~500 KB to every phone. Load it
behind a dynamic `import()` gated on the same condition that decides whether to run it, and
confirm from the resource timing that mobile never fetches the chunk.

### Touch targets under 44 px

Header nav links styled with em-based padding land near 25 px. Set an explicit `min-height`
and centre the label.

## The pass itself

1. **Console and server logs clean** — no errors, no failed requests.
2. **Boot completes** — preloader removed, `is-loading` cleared, scroll unlocked.
3. **No horizontal scroll** at 1440, 1024, 768, and 375, tested with the scroll probe above.
4. **Contrast** computed for every text colour against its ground; all real text ≥ 4.5:1.
5. **Screenshot every section** at desktop width and actually look at each one.
6. **Mobile at 375–390** — pinning off, heavy libraries not fetched, nothing overflowing,
   no words broken mid-token.
7. **Reduced motion** via a `matchMedia` init-script override — page usable, no frozen
   states, no plate playing, motion toggle offering to start.
8. **Motion toggle** stops and restarts every plate, hero included.
9. **Touch targets** measured, not assumed.
10. **Production build succeeds**; review the chunk sizes against the budget in SKILL.md and
    split anything unreasonable.
11. **Clear text selection before screenshotting** — a stray selection highlight looks
    exactly like a design bug and will send you chasing nothing.

## Reporting

Say what broke and why it would have hurt a visitor, in plain terms. "The preloader hung
forever in a background tab" tells the user something; "fixed a race condition" does not.
If something is a limitation rather than a defect, name it as a limitation.
