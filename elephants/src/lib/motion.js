import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** True when the OS asks for reduced motion. Re-evaluates if the user flips it. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

/**
 * Scroll-reveal for every [data-reveal] inside `scope`.
 * data-reveal="up" | "fade" | "stagger" — stagger uses grid:'auto' so a CSS
 * grid reveals as a wave rather than a straight line.
 */
export function useReveal(scope, reduced) {
  useEffect(() => {
    if (reduced || !scope.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const kind = el.dataset.reveal || 'up'

        if (kind === 'stagger') {
          gsap.set(el, { opacity: 1 })
          gsap.from(el.children, {
            opacity: 0,
            scale: 0.94,
            y: 18,
            duration: 0.45,
            ease: 'back.out(1.4)',
            stagger: { each: 0.06, from: 'start', grid: 'auto' },
            scrollTrigger: { trigger: el, start: 'top 82%' },
          })
          return
        }

        gsap.fromTo(
          el,
          { opacity: 0, y: kind === 'fade' ? 0 : 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
    }, scope)
    return () => ctx.revert()
  }, [scope, reduced])
}

/** Counts an element's text from 0 to `value` once it scrolls into view. */
export function useCountUp(ref, value, { decimals = 0, suffix = '' } = {}) {
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const format = (n) =>
      n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix

    if (reduced) {
      el.textContent = format(value)
      return
    }

    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = format(counter.n)
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [ref, value, decimals, suffix, reduced])
}

/** Lenis smooth scroll, wired into ScrollTrigger's ticker. Off when reduced. */
export function useSmoothScroll(reduced) {
  const lenisRef = useRef(null)
  useEffect(() => {
    if (reduced) return
    let lenis
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({ duration: 1.05, smoothWheel: true })
      lenisRef.current = lenis
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      lenis._gsapTick = tick
    })

    return () => {
      cancelled = true
      if (lenis) {
        gsap.ticker.remove(lenis._gsapTick)
        lenis.destroy()
      }
      lenisRef.current = null
    }
  }, [reduced])
  return lenisRef
}
