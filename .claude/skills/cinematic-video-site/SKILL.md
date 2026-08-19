---
name: cinematic-video-site
description: Two-phase workflow for premium video-driven websites. Phase one writes long, production-grade Google Flow (Veo) prompts for a niche the user names; phase two builds the finished site around the clips they bring back. Use this whenever the user wants a cinematic, animated, or "wow" website, a video-heavy landing page, a site they intend to sell as a template, asks for Flow/Veo/AI video prompts to use on a site, or drops a folder of generated clips and wants something built around them. It also applies when they only say "make me a beautiful animated site" without mentioning video at all — the video-first route is usually what they actually want.
---

# Cinematic video-first websites

This workflow produces sites where generated footage is the substance, not decoration.
It runs in two phases with a gap in the middle: the user leaves to generate video, then
comes back. Phase one has to be good enough that they don't waste that trip.

The thing that makes these sites worth money is not the animation library. It's that every
design decision is traceable to the footage. A buyer can tell the difference between a
dark template with videos dropped in and a site that was clearly built around *these*
clips, even if they can't articulate why.

## Phase 1 — Write the plate prompts

The user names a niche, or says "anything". Either way, produce prompts they can paste
straight into Flow.

**Commit to a concrete subject first.** Name the business, its audience, and the single job
the page does, in one short paragraph. If the user said "any", pick something with a wide
resale pool — a creative studio, a premium product brand, luxury property — and say in one
sentence why you picked it. Vagueness here produces vague footage, and footage is the
expensive part.

**Pick a page structure before writing a single prompt.** Read
`references/page-structures.md` and choose one that suits the subject — a restaurant and a
SaaS product do not want the same page, and reaching for the same shape every time is how a
workflow degenerates into a template. Then present the section map as a small table so the
user can see what each clip is for. Prompts written without a slot produce clips that have
nowhere to go.

**Then write one prompt per slot.** How many depends entirely on the structure — a long-form
editorial page wants three superb plates, a catalogue wants a dozen cheap ones. Read
`references/flow-prompts.md` for the anatomy of a prompt that survives Veo and three worked
examples in deliberately different registers. Write them in English even when the conversation
is in another language — Veo is trained on English and degrades noticeably otherwise.

Dark and cinematic is one register, not the default. A bakery, a children's clinic, or a
linen brand will be badly served by crushed blacks and amber rim light. Let the subject
choose the register before you start writing camera clauses.

**Give a file-naming contract.** Tell the user exactly what to name each download. This is
what makes phase two mechanical instead of a guessing game. Also name the minimum viable
subset — the hero plus two or three that carry the most weight in your structure — so they
can see something running before committing to the whole set.

**Offer to re-cut for a different niche before they generate.** Rewriting ten prompts costs
you one message; regenerating ten clips costs them real time and money. Make that trade
explicit.

## Phase 2 — Build

### Inventory before anything else

`ffprobe` every file. Confirm the aspect ratios and durations match what the section map
expects. Map each delivered filename to its role and show the user the mapping — they may
have renamed things or generated a clip twice.

**Design for what arrived, not for what you asked for.** Footage rarely comes back matching
the plan: a clip is missing, one is in the wrong ratio, one is simply better than expected
and deserves more room. Adapt the layout to the material and tell the user plainly which
sections you changed and why — "the architecture plate came back 16:9 rather than vertical,
so that case is now a full-width band instead of a card" is useful information. Building a
section around a clip that does not exist, or forcing a landscape clip into a portrait slot
and cropping the subject out, are both worse than restructuring.

If something is genuinely unusable, say so and offer to write a replacement prompt. Do not
quietly ship a weak plate in a hero slot.

### Encode

Run the bundled encoder:

```bash
python scripts/encode_plates.py --src <downloads-dir> --out <project>/public/video --map <mapping.json>
```

It produces `name.mp4`, `name.webm`, and `name.jpg` (poster) per plate, then **deletes any
webm that came out larger than its mp4**. That check matters: VP9 loses to x264 on grain
and high-frequency detail, and since webm is listed first in `<source>`, the browser will
cheerfully download the bigger file. Run `--help` for the flags.

Compress decorative plates far harder than hero plates. A film-grain overlay running at low
opacity behind a blend mode can drop from 25 MB to under 400 KB with nobody noticing.

Budget, so "compress harder" means something:

| | Target |
|---|---|
| First screen (before any scroll) | under 3 MB |
| Hero plate alone | under 2.5 MB |
| Any single below-fold plate | under 3 MB |
| Decorative overlay | under 500 KB |
| Whole site, all plates | under 20 MB |
| Main JS bundle | under 200 KB, gzip under 70 KB |

Everything past the first screen is lazy-loaded, so the total matters far less than the first
number. If the first screen is over budget, that is the one to fix.

### Derive the design from the footage

This is the step that separates this workflow from a template, so do it deliberately.

Open the poster frames and actually look at them. Then name, in one sentence, the thing
every clip has in common — not the subject matter, the *treatment*. "One warm light source
carving a subject out of near-black." "Overcast flat daylight on matte surfaces." "Saturated
neon bounce on wet glass." That sentence is your palette brief, and it came from the
material rather than from a mood board.

Sample real values out of the frames. Then:

- **Never pure `#000` as the ground.** It smears on OLED and crushes the shadow detail the
  footage was graded for. Something like `#08070A` reads as black and holds the grade.
- **One accent, and only one.** The footage already has a dominant hue; use it and nothing
  else. A second accent is what makes a site look like a theme.
- **Cold colours live in hairlines and shadows**, not in UI.

If you consult a design-system tool or database, treat its *structure* as useful and its
*surface* as a starting point to argue with. When one hands you Inter paired with Inter and
a palette of default Tailwind hexes, that is the generic answer it would give any dark site,
not a choice about this one. Say so out loud, keep the layout pattern and the accessibility
checklist, and derive the colours and type yourself.

### Find a structural device that tells the truth

Numbered markers (01 / 02 / 03) are correct only when the content genuinely is a sequence.
Most of the time they are decoration wearing a uniform.

Look at the material for a system that is already true of it. Ten eight-second clips are
eighty seconds of runtime, which makes a real timecode rail honest: scroll position becomes
the playhead and the readout is not invented. A property site might index by floor level. A
product site might index by assembly step. The test is whether a viewer could derive the
numbers from the content itself. If not, drop the device.

### Spend boldness in exactly one place

Pick one move that people will remember, execute it precisely, and keep everything around
it quiet. A variable font's width axis animating like an anamorphic desqueeze. A single
element that survives a page transition. A scrubbed mask.

Then take one thing away. If two elements are competing to be the memorable one, neither
wins.

### Write copy like the business exists

This is the difference nobody credits and everybody notices. A site with immaculate motion
and copy reading "Elevate your brand with cutting-edge solutions" is obviously machine-made,
and a buyer will feel it even if they cannot name it.

Invent the business properly before writing a word of it: how many people, where, since when,
what they refuse to do, what they are slightly difficult about. Then let the copy report
facts from that world instead of making claims about it.

- **Specific beats impressive.** "We make thirty seconds that people finish watching" says
  more than "award-winning video production". Numbers, place names, constraints, and
  materials all carry conviction; adjectives do not.
- **Have an opinion, and let it cost something.** "There is no account manager between you
  and the person holding the camera" is a real position with a real trade-off. Copy that
  could not possibly offend anyone reads as filler.
- **Headlines should be sayable.** "Bring us something difficult" is a sentence a person
  would say. "Transforming Visions Into Reality" is not.
- **Labels label.** In navigation, buttons, and metadata, drop the voice and be plain. The
  personality lives in the headlines and body copy, not in renaming Contact to "Let's Connect".
- **Detail is texture.** Invented credits, rig lists, cities, lead times, and dates make a
  page feel lived-in. Keep them internally consistent — the same city, plausible dates.
- **Read it back for tells.** Tricolons, "not just X but Y", "in a world where", "seamless",
  "elevate", "unlock", "journey", em-dash-heavy rhythm, every paragraph the same length. If
  the `anti-ai-slop-writing` skill is available, use it for this pass.

Keep a running list of everything you invent — names, numbers, addresses — because the handoff
needs it.

### Build

Default to a **static Vite build with vanilla ES modules** unless the user needs a
framework. It is the most resellable form — any buyer can host it anywhere — and a
scroll-driven marketing page gains nothing from a component runtime.

- GSAP + ScrollTrigger for choreography, Lenis for smooth scroll
- Drive Lenis from GSAP's ticker so there is **one** rAF loop; two loops is what makes
  pinned sections judder
- Three.js only if a shader genuinely earns its place, and **behind a dynamic import** so
  the ~500 KB never reaches phones that will not run it
- Everything themeable through CSS custom properties in one tokens file

Consult the relevant animation, 3D, and design skills for implementation detail — this
skill governs the approach, not the API surface.

### Verify in a real browser, hunting specific defects

Do not stop at "it loads". Read `references/build-checklist.md` and work through it. It
lists the failure modes this kind of site produces over and over — preloaders that never
lift, reduced-motion states frozen mid-animation, transparent pinned sections, scaled
elements opening a horizontal scrollbar, muted colour tokens that quietly fail contrast.

Measure rather than eyeball. Compute contrast ratios in the page, query for elements
overflowing the viewport, read back computed styles. Screenshot each section and look at it.

When you find something, say plainly what broke and why it would have hurt a real visitor.
That is more useful to the user than a clean report.

### Hand off

Write a README covering: how to run and build, where the plates live and how to swap them,
the encoding command used, which custom properties to change to re-skin, and what the site
does at each breakpoint and under reduced motion.

**Flag every placeholder explicitly** — invented client names, phone numbers, addresses,
credits. Someone about to sell or ship this needs a list of what is fictional, not a
pleasant surprise later.

## Reference files

- `references/page-structures.md` — six page shapes and what each implies for the plate
  manifest. Read this in phase one, *before* writing prompts.
- `references/flow-prompts.md` — prompt anatomy, plate roles, three worked examples in
  different registers, and the Flow settings that matter. Read this in phase one.
- `references/build-checklist.md` — the verification pass and the recurring defect classes.
  Read this before declaring phase two done.
- `scripts/encode_plates.py` — batch encoder and poster extractor with the webm-vs-mp4 check.
