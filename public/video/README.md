# /public/video

Four clips, referenced by fixed names. Replace the files in place — nothing in
the code needs to change.

| File              | Used in                        | Fallback colour |
| ----------------- | ------------------------------ | --------------- |
| `hero.mp4`        | Fixed backdrop behind the hero | `#0B0B0C`       |
| `smoke.mp4`       | Philosophy, full bleed         | `#0B0B0C`       |
| `ingredients.mp4` | Composition, 4:5 panel         | `#4A5240`       |
| `transition.mp4`  | Composition, 16:9 panel        | `#8A5A2B`       |

Each `.mp4` has a matching `.jpg` poster of the same name. Regenerate one after
swapping a clip:

```bash
ffmpeg -y -i public/video/hero.mp4 -vf "select=eq(n\,0)" -frames:v 1 -q:v 3 public/video/hero.jpg
```

If a file is missing the page still renders: the `<video>` element paints
nothing and the solid fallback colour behind it shows through. Under
`prefers-reduced-motion: reduce` no `<video>` is mounted at all — the posters
are rendered as plain `<img>`.
