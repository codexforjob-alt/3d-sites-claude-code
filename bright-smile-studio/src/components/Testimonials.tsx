'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { reviews } from '@/lib/content'
import { SectionHeading } from './SectionHeading'
import { useMotionPref } from './MotionProvider'

const AVATAR_TINTS = [
  'bg-mint text-brand-deep',
  'bg-soft-50 text-soft-blue',
  'bg-mint-50 text-brand-deep',
  'bg-[#E7F0F2] text-ink',
  'bg-mint text-brand-deep',
]

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
}

export function Testimonials() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [held, setHeld] = useState(false)
  const { reduced } = useMotionPref()
  const liveRef = useRef<HTMLDivElement>(null)

  const go = useCallback((next: number, direction: number) => {
    setState([(next + reviews.length) % reviews.length, direction])
  }, [])

  useEffect(() => {
    if (reduced || held) return
    const id = window.setInterval(() => {
      setState(([i]) => [(i + 1) % reviews.length, 1])
    }, 7000)
    return () => window.clearInterval(id)
  }, [reduced, held])

  const review = reviews[index]

  return (
    <section id="reviews" className="scroll-mt-24 bg-mist py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Отзывы"
          title="Что говорят пациенты"
          lede="Демонстрационные отзывы: имена сокращены до инициалов, аватары — заглушки."
          align="center"
        />

        <div
          data-reveal
          className="mx-auto mt-14 max-w-3xl"
          role="group"
          aria-roledescription="карусель"
          aria-label="Отзывы пациентов"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(index + 1, 1)
            if (e.key === 'ArrowLeft') go(index - 1, -1)
          }}
        >
          <div className="relative min-h-[22rem] overflow-hidden rounded-4xl border border-line bg-white p-8 sm:min-h-[19rem] sm:p-12">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.blockquote
                key={index}
                custom={dir}
                variants={slide}
                initial={reduced ? 'center' : 'enter'}
                animate="center"
                exit={reduced ? 'center' : 'exit'}
                transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col justify-between gap-8"
              >
                <p className="text-[clamp(1.05rem,2vw,1.4rem)] leading-[1.6] text-ink">
                  «{review.text}»
                </p>
                <footer className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
                      AVATAR_TINTS[index % AVATAR_TINTS.length]
                    }`}
                  >
                    {review.initials.replace(/[\s.]/g, '')}
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium text-ink">{review.initials}</span>
                    <span className="block text-ink-soft">{review.meta}</span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div ref={liveRef} aria-live="polite" className="sr-only">
            Отзыв {index + 1} из {reviews.length}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Выбор отзыва">
              {reviews.map((r, i) => (
                <button
                  key={r.initials}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Отзыв ${i + 1}`}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  className="group cursor-pointer p-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === index
                        ? 'w-8 bg-brand-deep'
                        : 'w-2.5 bg-line group-hover:bg-brand/60'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { label: 'Предыдущий отзыв', d: 'M15 6l-6 6 6 6', delta: -1 },
                { label: 'Следующий отзыв', d: 'M9 6l6 6-6 6', delta: 1 },
              ].map((btn) => (
                <motion.button
                  key={btn.label}
                  type="button"
                  onClick={() => go(index + btn.delta, btn.delta)}
                  aria-label={btn.label}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand hover:text-brand-deep"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d={btn.d} />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
