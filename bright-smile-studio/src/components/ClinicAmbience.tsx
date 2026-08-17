'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { VideoBackground } from './VideoBackground'
import { SmileArc } from './SmileArc'
import { useMotionPref } from './MotionProvider'

const facts = [
  { k: 'Отдельная стерилизационная', v: 'инструменты в индивидуальных пакетах с датой' },
  { k: 'Кабинет без очереди', v: 'приём по времени, запас 15 минут между пациентами' },
  { k: 'Тихая зона ожидания', v: 'без телевизора и запаха клиники' },
]

export function ClinicAmbience() {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotionPref()

  useGSAP(
    () => {
      if (reduced) return
      gsap.fromTo(
        '[data-ambience-media]',
        { yPercent: -8, scale: 1.14 },
        {
          yPercent: 8,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <section
      ref={root}
      aria-labelledby="ambience-title"
      className="relative isolate flex min-h-[90svh] items-end overflow-hidden bg-ink"
    >
      <div data-ambience-media className="absolute inset-0 -z-10">
        <VideoBackground name="clinic-ambience" className="absolute inset-0" />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent"
      />

      <div className="container-page w-full py-20 sm:py-28">
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow !text-mint">
            Атмосфера клиники
          </p>
          <h2
            id="ambience-title"
            data-reveal
            className="h-section mt-4 !text-white"
          >
            Здесь тихо, светло и пахнет мятой, а не страхом
          </h2>
          <p data-reveal className="mt-6 max-w-prose text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-white/85">
            Мы спроектировали пространство так, чтобы ожидание не добавляло тревоги:
            дневной свет, живые растения и никакого звука бормашины в холле.
          </p>
          <SmileArc
            className="mt-8 h-4 w-28 text-mint"
            strokeWidth={4}
          />
        </div>

        <dl className="mt-14 grid gap-8 border-t border-white/20 pt-10 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.k} data-reveal>
              <dt className="font-display text-base font-semibold text-white">{f.k}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-white/75">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
