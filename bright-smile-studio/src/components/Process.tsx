'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { processSteps } from '@/lib/content'
import { VideoBackground } from './VideoBackground'
import { useMotionPref } from './MotionProvider'

/**
 * The treatment timeline. On desktop the section pins and the steps light up in
 * order as the page scrolls, with the signature curve drawing alongside them.
 * On small screens — and whenever motion is reduced — it degrades to a plain list.
 */
export function Process() {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotionPref()

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-step]')
      const path = root.current?.querySelector<SVGPathElement>('[data-progress-path]')
      const len = path?.getTotalLength() ?? 0
      if (path) gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })

      const mm = gsap.matchMedia(root)

      mm.add(
        {
          pinned: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          plain: '(max-width: 1023px), (prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { pinned } = ctx.conditions as { pinned: boolean }

          if (!pinned || reduced) {
            gsap.set(items, { opacity: 1 })
            if (path) gsap.set(path, { strokeDashoffset: 0 })
            return
          }

          gsap.set(items, { opacity: 0.28 })
          gsap.set(items[0], { opacity: 1 })

          const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: `+=${items.length * 62}%`,
              pin: '[data-pin-inner]',
              scrub: 0.5,
              anticipatePin: 1,
            },
          })

          items.forEach((el, i) => {
            if (i === 0) return
            tl.to(items[i - 1], { opacity: 0.28, duration: 0.45 }, i)
            tl.to(el, { opacity: 1, duration: 0.45 }, i)
          })

          if (path) {
            tl.to(path, { strokeDashoffset: 0, duration: items.length, ease: 'none' }, 0)
          }
          tl.to('[data-step-media]', { scale: 1.06, duration: items.length, ease: 'none' }, 0)
        },
      )

      return () => mm.revert()
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <section
      ref={root}
      id="process"
      className="scroll-mt-24 overflow-hidden bg-white py-24 sm:py-32 lg:py-0"
    >
      <div data-pin-inner className="lg:flex lg:min-h-[100svh] lg:items-center lg:py-16">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
            <div className="lg:sticky lg:top-32">
              <p data-reveal className="eyebrow">
                Процесс лечения
              </p>
              <h2 data-reveal className="h-section mt-4">
                Пять шагов, о которых договариваемся заранее
              </h2>
              <p data-reveal className="lede mt-5 max-w-md">
                Ни один этап не начинается, пока вы не увидели, что в него входит и
                сколько он стоит.
              </p>

              <div
                data-reveal
                className="relative mt-10 hidden h-40 w-40 overflow-hidden rounded-full border border-line bg-mint-50 lg:block"
              >
                <div data-step-media className="absolute inset-0">
                  <VideoBackground name="tooth-loop" className="absolute inset-0" />
                </div>
              </div>
            </div>

            <div className="relative">
              {/* The signature curve, drawn by scroll alongside the steps. */}
              <svg
                viewBox="0 0 40 600"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
                className="pointer-events-none absolute -left-1 top-2 hidden h-[calc(100%-1rem)] w-10 sm:block"
              >
                <path
                  d="M20 6C44 120 -4 220 20 300 44 380 -4 480 20 594"
                  stroke="var(--line)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <path
                  data-progress-path
                  d="M20 6C44 120 -4 220 20 300 44 380 -4 480 20 594"
                  stroke="var(--brand)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>

              <ol className="space-y-4 sm:pl-14 lg:space-y-3">
                {processSteps.map((s) => (
                  <li
                    key={s.step}
                    data-step
                    className="rounded-4xl border border-line bg-white p-6 sm:p-8 lg:p-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-display text-lg font-semibold sm:text-xl">
                        <span className="mr-3 font-mono text-sm font-normal text-brand">
                          {s.step}
                        </span>
                        {s.title}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                        {s.duration}
                      </span>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
