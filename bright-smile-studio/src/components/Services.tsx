'use client'

import { motion } from 'framer-motion'
import { services } from '@/lib/content'
import { serviceIcons } from './icons/ServiceIcons'
import { SectionHeading } from './SectionHeading'

const card = {
  rest: { y: 0, boxShadow: '0 1px 2px rgba(10,58,68,0.04)' },
  hover: { y: -6, boxShadow: '0 24px 48px -28px rgba(10,58,68,0.4)' },
}

const badge = {
  rest: { backgroundColor: 'rgb(237,250,247)', color: 'rgb(7,96,108)', rotate: 0 },
  hover: { backgroundColor: 'rgb(7,96,108)', color: 'rgb(255,255,255)', rotate: -6 },
}

const arrow = {
  rest: { x: 0, opacity: 0.45 },
  hover: { x: 6, opacity: 1 },
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Услуги"
          title="Шесть направлений, один подход"
          lede="Каждое лечение начинается с осмотра и заканчивается планом, который вы уносите с собой. Сроки ниже — ориентир для первого разговора, а не обещание."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcons[service.id]
            return (
              <li key={service.id} data-reveal>
                <motion.article
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileFocus="hover"
                  variants={card}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  tabIndex={0}
                  className="group h-full cursor-pointer rounded-4xl border border-line bg-white p-7 transition-colors hover:border-brand/50"
                >
                  <motion.span
                    variants={badge}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                  >
                    <Icon className="h-8 w-8" />
                  </motion.span>

                  <h3 className="mt-6 font-display text-xl font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                    {service.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-deep">
                      {service.meta}
                    </span>
                    <motion.span variants={arrow} className="text-brand-deep">
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
                    </motion.span>
                  </div>
                </motion.article>
              </li>
            )
          })}
        </ul>

        <p data-reveal className="mt-8 text-sm text-ink-soft">
          Не нашли свою ситуацию?{' '}
          <a
            href="#booking"
            className="font-medium text-brand-deep underline underline-offset-4 hover:text-brand"
          >
            Опишите её в заявке
          </a>{' '}
          — подберём врача на консультацию.
        </p>
      </div>
    </section>
  )
}
