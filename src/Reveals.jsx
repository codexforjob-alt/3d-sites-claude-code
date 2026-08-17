import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './hooks/useMediaFlags'

gsap.registerPlugin(ScrollTrigger)

export default function Reveals() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      // Section copy rises into place once, as it enters.
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 85%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power2.out',
            overwrite: true,
          }),
      })

      // The fixed backdrop drifts slower than the page, so the hero video
      // reads as sitting behind the type rather than moving with it.
      const backdrop = document.querySelector('[data-parallax]')
      if (backdrop) {
        gsap.to(backdrop, {
          yPercent: 12,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return null
}
