/* ─────────────────────────────────────────────────────────────
   Procedural savanna scene, drawn on canvas.

   Everything on this site is generated in code — no stock photography,
   no image-sequence download. The hero scrub feeds scroll progress into
   `render(p)` instead of stepping through pre-rendered frames, which
   keeps the payload at zero bytes and the scrub perfectly smooth.
   ───────────────────────────────────────────────────────────── */

import { ANCHOR, ORDER, PARTS } from './elephant-path'

// Path2D objects are built once and reused for every animal in every frame.
const SHAPE = ORDER.map((k) => new Path2D(PARTS[k]))

/** The shared silhouette on canvas: feet on `y`, centred on `x`. */
export function drawElephant(ctx, x, y, s, flip = false) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(flip ? -s : s, s)
  ctx.translate(-ANCHOR.x, -ANCHOR.y)
  for (const part of SHAPE) ctx.fill(part)
  ctx.restore()
}

/** Height of the silhouette in path units — used to size it against a scene. */
const UNIT_HEIGHT = 69

const HILLS = [
  { y: 0.74, amp: 0.035, freq: 1.7, color: '#2a2119', par: 0.06 },
  { y: 0.8, amp: 0.028, freq: 2.6, color: '#1e1813', par: 0.13 },
  { y: 0.88, amp: 0.02, freq: 3.9, color: '#14100c', par: 0.24 },
]

/**
 * Mounts a scene on `canvas`. Returns { render(progress), resize(), destroy() }.
 * `render` is idempotent and cheap enough to call from a scrub tick.
 */
export function createSavannaScene(canvas) {
  const ctx = canvas.getContext('2d')
  let w = 0
  let h = 0
  let raf = 0
  let progress = 0
  let t = 0
  let animating = true

  // fixed dust field — seeded once so the scene is deterministic per mount
  const motes = Array.from({ length: 90 }, (_, i) => ({
    x: ((i * 97) % 1000) / 1000,
    y: ((i * 61) % 1000) / 1000,
    r: 0.4 + (((i * 37) % 100) / 100) * 1.6,
    sp: 0.1 + (((i * 53) % 100) / 100) * 0.5,
    a: 0.05 + (((i * 29) % 100) / 100) * 0.22,
  }))

  const herd = [
    { x: 0.2, scale: 0.5, par: 0.3, flip: false },
    { x: 0.33, scale: 0.36, par: 0.3, flip: false },
    { x: 0.62, scale: 0.62, par: 0.22, flip: true },
    { x: 0.78, scale: 0.44, par: 0.22, flip: true },
    { x: 0.87, scale: 0.3, par: 0.22, flip: true },
  ]

  function resize() {
    // offsetWidth/Height, not getBoundingClientRect — the card this canvas
    // lives in is scale-transformed by the scrub, and the backing store must
    // track the *layout* size or it would be reallocated on every tick.
    const nw = canvas.offsetWidth
    const nh = canvas.offsetHeight
    if (!nw || !nh || (nw === w && nh === h)) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = nw
    h = nh
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    draw()
  }

  function hill(band, p) {
    const shift = p * band.par * w * 2
    const baseY = h * band.y - p * h * 0.06
    ctx.fillStyle = band.color
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 8) {
      const n =
        Math.sin(((x + shift) / w) * band.freq * Math.PI * 2) * 0.6 +
        Math.sin(((x + shift) / w) * band.freq * 4.3 + 1.7) * 0.4
      ctx.lineTo(x, baseY + n * band.amp * h)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
  }

  function draw() {
    if (!w || !h) return
    const p = progress

    // sky — night at rest, dawn as the scrub advances
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    const warm = 0.25 + p * 0.75
    sky.addColorStop(0, `rgb(${10 + warm * 22}, ${9 + warm * 14}, ${14 + warm * 12})`)
    sky.addColorStop(0.55, `rgb(${28 + warm * 78}, ${20 + warm * 44}, ${20 + warm * 24})`)
    sky.addColorStop(1, `rgb(${52 + warm * 148}, ${34 + warm * 88}, ${24 + warm * 36})`)
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)

    // sun — climbs and warms across the scrub
    const sunY = h * (0.72 - p * 0.3)
    const sunR = Math.min(w, h) * (0.075 + p * 0.03)
    const glow = ctx.createRadialGradient(w * 0.5, sunY, 0, w * 0.5, sunY, sunR * 7)
    glow.addColorStop(0, `rgba(255, 198, 122, ${0.34 + p * 0.3})`)
    glow.addColorStop(1, 'rgba(255, 170, 90, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = `rgba(255, ${196 + p * 40}, ${140 + p * 60}, ${0.55 + p * 0.4})`
    ctx.beginPath()
    ctx.arc(w * 0.5, sunY, sunR, 0, Math.PI * 2)
    ctx.fill()

    hill(HILLS[0], p)

    // the herd walks the mid ridge, silhouetted against the sun
    // Sit the feet just above the second ridge's highest crest so the herd
    // stands on the rise instead of being buried by it.
    const groundY = h * HILLS[1].y - p * h * 0.06 - h * 0.026
    ctx.fillStyle = '#0d0a08'
    herd.forEach((e, i) => {
      const bob = animating ? Math.sin(t * 1.6 + i * 1.3) * h * 0.0035 : 0
      const drift = ((e.x + p * e.par * 0.55) % 1.25) - 0.12
      // 0.25h tall at scale 1, so the matriarch reads at roughly a sixth of the
      // frame — big enough to identify, small enough to stay landscape.
      drawElephant(ctx, drift * w, groundY + bob, ((h * 0.25) / UNIT_HEIGHT) * e.scale, e.flip)
    })

    hill(HILLS[1], p)
    hill(HILLS[2], p)

    // dust
    motes.forEach((m) => {
      const y = ((m.y + (animating ? t * 0.012 * m.sp : 0)) % 1) * h
      const x = ((m.x + p * 0.12 * m.sp) % 1) * w
      ctx.fillStyle = `rgba(226, 198, 158, ${m.a * (0.4 + p * 0.6)})`
      ctx.beginPath()
      ctx.arc(x, y, m.r, 0, Math.PI * 2)
      ctx.fill()
    })

    // vignette
    const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.6)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, w, h)
  }

  function loop() {
    t += 1 / 60
    draw()
    raf = requestAnimationFrame(loop)
  }

  // ResizeObserver rather than a window listener: at mount the canvas has no
  // laid-out size yet, and the card also resizes on breakpoint changes.
  const ro = new ResizeObserver(() => resize())
  ro.observe(canvas)
  resize()

  return {
    render(p) {
      progress = p
      if (!animating) draw()
    },
    start() {
      if (!raf) {
        animating = true
        raf = requestAnimationFrame(loop)
      }
    },
    freeze() {
      animating = false
      cancelAnimationFrame(raf)
      raf = 0
      draw()
    },
    destroy() {
      cancelAnimationFrame(raf)
      ro.disconnect()
    },
  }
}
