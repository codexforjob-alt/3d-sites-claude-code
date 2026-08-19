# Writing Google Flow (Veo) prompts for website plates

## Why these prompts are long

Veo fills in whatever you leave unspecified, and its defaults are generic — centred subject,
mid shot, neutral grade, restless handheld camera. Every clause you write is a default you
take away from it. A three-line prompt returns stock footage; a 150-word prompt returns
something that looks directed.

The other reason for length: web plates have constraints stock footage does not. They need
empty regions for text, they need to loop, and they must not contain text or logos of their
own. Those have to be stated or you will get a clip with a burnt-in brand name across the
exact area your headline occupies.

## Anatomy

Write each prompt as flowing prose, not a bulleted spec — Veo responds better to it. Work
through these in roughly this order:

1. **Subject and action.** One thing doing one thing. Two events in eight seconds reads as
   a jump cut.
2. **Camera and lens.** Name a body and a focal length ("ARRI Alexa 65, 100mm macro probe,
   f/2.8"). This is the single highest-leverage clause — it pins depth of field, perspective
   compression, and the whole image's character at once.
3. **Lighting.** Where the key is, what it does, and how dark the fill is. "Single hard key
   from camera left at a low rake angle, deep unlit shadows filling 70 percent of frame."
4. **Camera movement.** Say the rig and the quality: "slow lateral tracking shot, constant
   speed, gimbal-stabilised, no handheld shake." Left unsaid, Veo drifts.
5. **Colour grade.** Name the palette and a stock or print emulation. "Crushed blacks, warm
   amber highlights, teal in the deepest shadows, Kodak 2383 print emulation, fine 35mm
   grain."
6. **Mood.** Three or four adjectives. Cheap to write, changes a lot.
7. **Composition note tied to the layout.** "The upper third stays empty negative space for
   an overlaid headline." This is what makes the clip usable rather than merely pretty.
8. **Negative list.** Always: `No text, no letters, no logos, no watermarks, no captions.`
   Add per clip: no faces, no readable brand names, no license plates, no signage, no
   visible hands or tank edges.
9. **Loop note**, for anything that loops on the page: "The first and last frame must be
   an undisturbed black mirror surface so the clip loops seamlessly."

Aim for roughly 120–180 words. Past that Veo starts dropping clauses.

## Flow settings to tell the user

- Mode **Text to Video**, model **Veo 3.1 Quality**, length **8 seconds**
- For seamless loops use **Frames to Video** with the same still as first and last frame
- Maximum available resolution; compression happens later in the build
- Audio is irrelevant — browsers require `muted` for autoplay
- If a clip comes back weak, regenerate on a new seed before touching the prompt. The prompt
  is usually not the problem.

## Naming and roles

The manifest comes from the page structure you chose (see `page-structures.md`), not from a
fixed list. What matters is that every plate has a named slot and a name the build can rely
on. Name files `role-subject`, lowercase, hyphenated: `hero-pour`, `case-01-linen`,
`detail-stitch`.

These functional roles recur across structures. Use the ones your structure actually needs.

| Role | Function | Ratio | Notes |
|---|---|---|---|
| `hero-<x>` | Full-bleed opening | 16:9 | Must loop. Keep one third quiet for the headline. |
| `pinned-<x>` | Plate the copy scrubs over | 16:9 | Low contrast in the middle; text sits on it. |
| `case-NN-<x>` | Portfolio or catalogue item | 9:16 | Vertical reads far better in a card. |
| `detail-<x>` | Macro cutaway | 1:1 or 9:16 | Cheap to generate, does a lot of work. |
| `transition-<x>` | Beat between sections | 16:9 | Something that expands to fill frame. |
| `texture-<x>` | Global overlay | 16:9 | Must loop, flat, no focal point. |
| `place-<x>` / `about-<x>` | Space or people | 16:9 | Leave a third clear for copy. |
| `cta-<x>` | Full-bleed closing | 16:9 | Big open area for a large headline. |
| `loader-<x>` | Preloader | 16:9 | Minimal, must loop, tiny after compression. |

A page needs three or four of these to work. Ten is a full set, not a requirement — say so,
and name the minimum subset, so the user can see something running before committing.

## Three worked examples

Same skeleton, three registers. Compare them — what changes is not the structure of the
prompt but the entire vocabulary of camera, light and grade. If your prompts for a bakery
read like your prompts for a car brand, you have written the same clip twice.

### 1 · Dark cinematic — a film studio hero

Clauses are labelled here so you can see the skeleton. Do not include labels in what you
hand the user.

> Extreme slow-motion macro cinematography of a vast pool of liquid black mercury, its
> surface a perfect mirror. A single heavy drop of molten amber-gold light falls into frame
> from above and impacts the surface, sending out one slow concentric ripple that expands
> toward the edges. `[subject + one action]`
>
> Shot on ARRI Alexa 65 with a 100mm macro probe lens, extremely shallow depth of field,
> f/2.8. `[camera + lens]` Lighting: single hard key from camera left at a low rake angle,
> deep unlit shadows filling 70 percent of the frame, one subtle amber rim light along the
> ripple crest. `[lighting]` Camera movement: an almost imperceptible slow push-in, locked
> and steady, no handheld shake. `[movement]` Colour grade: crushed blacks, warm amber and
> champagne highlights, teal in the deepest shadows, Kodak 2383 print emulation, fine 35mm
> grain. `[grade]` Mood: expensive, silent, weightless, hypnotic. `[mood]`
>
> The frame is mostly empty negative space in the upper third so text can be overlaid.
> `[composition]`
>
> No text, no letters, no logos, no watermarks, no people, no captions. `[negatives]` The
> first and last frame must be a calm, undisturbed black mirror surface so the clip loops
> seamlessly. `[loop]`

### 2 · Bright daylight — a bakery hero

Note what changed: no crushed blacks, no rim light, no amber grade. Overexposure and airiness
are doing the work that darkness did above. A "cinematic" bakery reads as a funeral.

> Slow-motion overhead shot of flour falling onto a worn oak worktop in soft morning light,
> settling into a fine drift around a rough ball of dough. A hand enters briefly at the edge
> of frame and withdraws. Shot on Sony Venice 2 with a 50mm prime, f/2.8, gentle shallow
> focus, 120fps. Lighting: enormous soft north-facing window light from camera right,
> generous bounce fill, no hard shadows anywhere, one bright blown-out highlight where the
> window falls on the wood. Camera movement: locked-off overhead, completely static. Colour
> grade: warm neutral whites, honey and oat tones, very low contrast, lifted blacks, clean
> and airy with almost no saturation in the shadows, natural daylight balance. Mood: unhurried,
> generous, domestic, early.
>
> The lower third of the frame is clean empty worktop for text. No text, no letters, no logos,
> no watermarks, no faces, no packaging, no readable brand names. First and last frame should
> both show settled, undisturbed flour so the clip loops.

### 3 · Clean clinical — a dental clinic plate

Here the register is precision and calm. No grain, no flare, no atmosphere — all the things
that make the first example feel expensive would make this one feel unhygienic.

> Slow, smooth tracking shot moving left to right through a bright, empty modern clinic
> interior. Pale terrazzo floor, matte white walls, one wall of frosted glass diffusing
> daylight, a single potted olive tree. Nothing moves except the camera. Shot on RED Komodo
> with a 35mm prime, f/5.6, deep focus, everything sharp, perfectly level horizon. Lighting:
> even, bright, shadowless ambient daylight with a cool-neutral balance, soft gradient falloff
> toward the ceiling. Camera movement: motorised slider, perfectly linear, constant slow speed,
> no shake, no drift. Colour grade: clean neutral whites, pale sage and warm grey, very low
> contrast, no grain, no lens flare, no halation, crisp and clinical. Mood: calm, ordered,
> quiet, safe.
>
> Right half of the frame is empty wall for text. No text, no letters, no logos, no
> watermarks, no people, no medical equipment, no signage.

## Registers

Choose one before you write. Pull camera bodies, lighting language, and materials from the
world the client actually lives in.

| Register | Light | Grade | Movement |
|---|---|---|---|
| Dark cinematic | Single hard key, deep unlit fill | Crushed blacks, one warm accent, grain | Slow, motion-control precise |
| Bright daylight | Huge soft window, generous bounce | Lifted blacks, low contrast, natural balance | Static or very slow drift |
| Clean clinical | Even shadowless ambient | Neutral, no grain, no flare, low contrast | Linear slider, deep focus |
| Saturated night | Neon practicals, wet reflections | High saturation, magenta/cyan push | Handheld-adjacent, faster |
| Editorial monochrome | Hard silver rim, black backdrop | Near-greyscale, high micro-contrast | Locked-off, 120fps subject motion |

Subject vernacular to pull from:

- **Property** — technocrane reveals, golden hour raking a facade, drone descents, 24mm
  tilt-shift with level verticals
- **Product / jewellery** — motion control, 1000fps, macro on wet or faceted surfaces, a
  travelling specular highlight
- **Food** — high-speed pours, steam in a hard backlight, macro on crumb and texture, warm
  practicals; usually bright, not dark
- **Fashion** — 120fps fabric in a wind machine, silhouettes behind translucency, large soft
  key with a hard silver rim
- **Health / care** — deep focus, shadowless light, slow linear moves, cool-neutral balance
- **Tech / SaaS** — abstract light refraction, liquid metal, clean geometry. Avoid screens
  and UI entirely; Veo generates unreadable fake text on them every time.
