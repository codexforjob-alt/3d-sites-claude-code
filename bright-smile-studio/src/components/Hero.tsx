'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useGSAP } from '@/lib/gsap'
import { VideoBackground } from './VideoBackground'
import { useMotionPref } from './MotionProvider'
import { clinic } from '@/lib/content'

const trust = [
  { k: '7 мин', v: 'пешком от метро' },
  { k: '09:00 — 21:00', v: 'приём в будни' },
  { k: '0 ₽', v: 'контроль через 3 месяца' },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const arc = useRef<SVGPathElement>(null)
  const { reduced } = useMotionPref()

  useGSAP(
    () => {
      const path = arc.current
      if (path) {
        const len = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len })
      }

      if (reduced) {
        gsap.set('[data-hero-in]', { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '[data-hero-in]',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
      )
      if (path) {
        tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.45')
      }

      // Background drifts slower than the page; the copy lifts away and fades.
      gsap.to(media.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to(content.current, {
        y: -70,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '70% top',
          scrub: 0.4,
        },
      })
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-white pt-[72px]"
    >
      <div ref={media} className="absolute inset-0 -z-10 -top-[8%] h-[116%]">
        <VideoBackground name="hero-waves" eager className="absolute inset-0" />
      </div>

      {/* Scrim: keeps the headline on near-white so ink text stays legible. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white/88 to-white/65 md:bg-gradient-to-r md:from-white md:via-white/80 md:to-transparent"
      />
      {/* Soft hand-off into the next section instead of a hard cut. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-white"
      />

      <div ref={content} className="container-page w-full py-16 sm:py-24">
        <div className="max-w-[44rem]">
          <p data-hero-in className="eyebrow">
            {clinic.address}
          </p>

          <h1 data-hero-in className="h-display mt-5">
            Лечим так, чтобы следующий визит был{' '}
            <span className="relative inline-block whitespace-nowrap">
              просто осмотром
              <svg
                viewBox="0 0 240 28"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
                className="absolute -bottom-2 left-0 h-3 w-full text-brand sm:-bottom-3 sm:h-4"
              >
                <path
                  ref={arc}
                  d="M3 5C58 26 182 26 237 5"
                  stroke="currentColor"
                  strokeWidth={7}
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p data-hero-in className="lede mt-8 max-w-prose">
            План лечения с ценой вы получаете на первом приёме. Дальше вас ведёт один
            врач — от диагностики до контрольного визита через три месяца.
          </p>

          <div data-hero-in className="mt-10 flex flex-wrap items-center gap-3">
            <motion.a
              href="#booking"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-deep px-7 py-4 text-base font-semibold text-white shadow-[0_10px_30px_-12px_rgba(7,96,108,0.7)] transition-colors hover:bg-brand"
            >
              Записаться на приём
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </motion.a>

            <motion.a
              href="#process"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              className="inline-flex cursor-pointer items-center rounded-full border border-brand/40 bg-white/70 px-7 py-4 text-base font-semibold text-brand-deep backdrop-blur transition-colors hover:border-brand hover:bg-white"
            >
              Как проходит лечение
            </motion.a>
          </div>

          <dl
            data-hero-in
            className="mt-14 grid max-w-lg grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3"
          >
            {trust.map((t) => (
              <div key={t.k} className="border-t border-line pt-3">
                <dt className="font-mono text-sm font-medium text-ink">{t.k}</dt>
                <dd className="mt-1 text-[13px] leading-snug text-ink-soft">{t.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
