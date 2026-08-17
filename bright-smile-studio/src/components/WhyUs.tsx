'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { advantages, stats } from '@/lib/content'
import { VideoBackground } from './VideoBackground'
import { SectionHeading } from './SectionHeading'
import { SmileArc } from './SmileArc'
import { useMotionPref } from './MotionProvider'

export function WhyUs() {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotionPref()

  useGSAP(
    () => {
      if (reduced) return
      gsap.to('[data-parallax-media]', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-parallax-frame]',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="why" className="scroll-mt-24 bg-mist py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Почему мы"
              title="Понятно, что происходит и сколько это стоит"
            />

            <div
              data-reveal
              data-parallax-frame
              className="relative mt-10 aspect-[4/5] overflow-hidden rounded-4xl border border-line bg-mint-50 sm:aspect-[5/4] lg:aspect-[4/5]"
            >
              <div data-parallax-media className="absolute -inset-y-[8%] inset-x-0">
                <VideoBackground name="smile-transform" className="absolute inset-0" />
              </div>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/95 via-ink/55 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <SmileArc className="h-3 w-16 text-mint" strokeWidth={5} />
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white">
                  Результат отбеливания держится дольше, если после процедуры прийти
                  на гигиену. Мы напомним — это входит в план.
                </p>
              </figcaption>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-4xl border border-line bg-line lg:mt-24">
            {advantages.map((item, i) => (
              <li key={item.title} data-reveal className="bg-white p-7 sm:p-9">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-brand" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg font-semibold sm:text-xl">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 pl-9 text-[15px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-reveal>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-ink">
                  {s.value}
                </span>{' '}
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-brand-deep">
                  {s.unit}
                </span>
                <p className="mt-3 text-sm leading-snug text-ink-soft">{s.label}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
