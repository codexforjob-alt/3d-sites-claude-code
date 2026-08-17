import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, usePrefersReducedMotion } from '../lib/motion'
import { createSavannaScene } from '../lib/savanna'

/*
  Scroll-scrub hero.

  Choreography adapted from "Hero Scrub" by @jean.duthil13 on 21st.dev
  (https://21st.dev/@jean.duthil13/components/hero-scrub): a tall section with
  an inner sticky stage, a card that scales from thumbnail to overfilled
  viewport and back, and the wordmark splitting apart as it goes.

  Two departures from the original: the card renders the procedural savanna
  scene instead of a 300-frame image sequence, and the title halves stay
  legible at rest rather than fading to nothing.
*/

const SECTION_VH = 4.2
const START_SCALE_DESKTOP = 0.78
const START_SCALE_MOBILE = 0.9
const OVERFILL = 1.04

export default function Hero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const cardRef = useRef(null)
  const topRef = useRef(null)
  const botRef = useRef(null)
  const capRef = useRef(null)
  const sceneRef = useRef(null)
  const [ready, setReady] = useState(false)
  const reduced = usePrefersReducedMotion()

  // scene
  useEffect(() => {
    if (!canvasRef.current) return
    const scene = createSavannaScene(canvasRef.current)
    sceneRef.current = scene
    if (reduced) {
      scene.render(0.6)
      scene.freeze()
    } else {
      scene.start()
    }
    setReady(true)
    return () => {
      scene.destroy()
      sceneRef.current = null
    }
  }, [reduced])

  // entry
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from(cardRef.current, { opacity: 0, duration: 1.1, ease: 'power3.out' })
        .from(topRef.current, { opacity: 0, y: 34, duration: 1, ease: 'expo.out' }, 0.15)
        .from(botRef.current, { opacity: 0, y: -34, duration: 1, ease: 'expo.out' }, 0.27)
        .from(capRef.current, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.6)
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  // scrub
  useEffect(() => {
    if (reduced || !ready) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const startScale = () => (window.innerWidth < 768 ? START_SCALE_MOBILE : START_SCALE_DESKTOP)
      // Measured off the card's own layout box rather than recomputed from a
      // hardcoded aspect — the card is 4:5 on mobile and 16:9 from md up.
      const immerseScale = () => {
        const el = cardRef.current
        const bw = el?.offsetWidth
        const bh = el?.offsetHeight
        if (!bw || !bh) return 1.6
        return Math.max(window.innerWidth / bw, window.innerHeight / bh) * OVERFILL
      }

      gsap.set(cardRef.current, { scale: startScale(), transformOrigin: '50% 50%' })

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const mapped = gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.63)
            sceneRef.current?.render(mapped)
          },
        },
      })

      const push = (w) => (window.innerWidth < 768 ? w * 1.15 : w)

      master
        .to(cardRef.current, { scale: 1, ease: 'power2.out', duration: 0.15 }, 0)
        .to(topRef.current, { x: () => push(-1) * 60 + 'vw', ease: 'power2.inOut', duration: 0.15 }, 0)
        .to(botRef.current, { x: () => push(1) * 60 + 'vw', ease: 'power2.inOut', duration: 0.15 }, 0)
        .to(capRef.current, { opacity: 0, ease: 'power1.in', duration: 0.1 }, 0)
        .to(cardRef.current, { scale: immerseScale, ease: 'power2.in', duration: 0.63 }, 0.15)
        .to([topRef.current, botRef.current], { opacity: 0, ease: 'power1.in', duration: 0.2 }, 0.15)
        .to(cardRef.current, { scale: startScale, ease: 'power3.inOut', duration: 0.22 }, 0.78)
        .to(
          [topRef.current, botRef.current],
          { x: 0, opacity: 1, ease: 'power2.inOut', duration: 0.22 },
          0.78,
        )
        .to(capRef.current, { opacity: 1, ease: 'power2.out', duration: 0.15 }, 0.85)

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative w-full overflow-clip"
      style={{ height: reduced ? '100svh' : `${SECTION_VH * 100}vh` }}
      aria-label="MATRIARCH — a herd at dawn"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
        <h1 className="sr-only">MATRIARCH — the herd remembers</h1>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 md:gap-3">
          <span
            ref={topRef}
            aria-hidden="true"
            className="font-display font-semibold text-bone will-change-transform"
            style={{ fontSize: 'clamp(2.4rem, 9.5vw, 8.5rem)', lineHeight: 0.86, letterSpacing: '-0.045em' }}
          >
            MATRI
          </span>

          <div
            ref={cardRef}
            className="relative aspect-[4/5] w-[min(86vw,calc(46svh*0.8))] overflow-hidden rounded-xl ring-1 ring-bone/10 shadow-[0_24px_90px_rgba(0,0,0,0.6)] will-change-transform md:aspect-video md:w-[min(88vw,calc(46svh*1.7778))]"
          >
            <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]"
            />
          </div>

          <span
            ref={botRef}
            aria-hidden="true"
            className="font-display font-semibold text-bone will-change-transform"
            style={{ fontSize: 'clamp(2.4rem, 9.5vw, 8.5rem)', lineHeight: 0.86, letterSpacing: '-0.045em' }}
          >
            ARCH
          </span>
        </div>

        <div
          ref={capRef}
          className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex flex-col items-center gap-2 px-6 text-center"
        >
          <p className="max-w-md text-xs text-ash sm:text-sm">
            A field collective working seven elephant ranges across Africa and South Asia.
          </p>
          {!reduced && (
            <span className="eyebrow flex items-center gap-2">
              Scroll
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
                <path
                  d="M5 0v14M1 10l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
