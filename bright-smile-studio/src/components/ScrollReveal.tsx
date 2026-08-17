'use client'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useMotionPref } from './MotionProvider'

/**
 * Single GSAP entry point for every `[data-reveal]` element on the page.
 * One batched ScrollTrigger beats one trigger per element, and reduced-motion
 * visitors get the finished state immediately.
 */
export function ScrollReveal() {
  const { reduced } = useMotionPref()

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      if (!targets.length) return

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' })
        ScrollTrigger.refresh()
        return
      }

      ScrollTrigger.batch(targets, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: true,
          }),
      })

      // Anything already above the fold when the batch is created.
      const visible = targets.filter(
        (el) => el.getBoundingClientRect().top < window.innerHeight * 0.88,
      )
      if (visible.length) {
        gsap.to(visible, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
        })
      }
    },
    { dependencies: [reduced], revertOnUpdate: true },
  )

  return null
}
