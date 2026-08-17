'use client'

import { motion } from 'framer-motion'
import { clinic, nav, services } from '@/lib/content'
import { SmileArc } from './SmileArc'

/** Flat 2D placeholder map — abstract blocks and streets, no real geography. */
function MapPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-line bg-mint-50">
      <svg
        viewBox="0 0 400 260"
        className="h-full w-full"
        role="img"
        aria-label="Схематичная карта-заглушка: клиника отмечена меткой в центре квартала"
      >
        <rect width="400" height="260" fill="var(--mint-50)" />
        <g fill="#ffffff" stroke="var(--line)" strokeWidth="1.5">
          <rect x="18" y="20" width="104" height="70" rx="6" />
          <rect x="18" y="112" width="104" height="52" rx="6" />
          <rect x="18" y="186" width="104" height="54" rx="6" />
          <rect x="150" y="20" width="118" height="52" rx="6" />
          <rect x="150" y="186" width="118" height="54" rx="6" />
          <rect x="296" y="20" width="86" height="70" rx="6" />
          <rect x="296" y="112" width="86" height="128" rx="6" />
        </g>
        <g stroke="var(--mint)" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M136 8v244" />
          <path d="M282 8v244" />
          <path d="M8 101h384" />
          <path d="M8 176h384" />
        </g>
        <rect
          x="150"
          y="112"
          width="118"
          height="52"
          rx="6"
          fill="#ffffff"
          stroke="var(--brand)"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
        <g transform="translate(197 122)">
          <path
            d="M12 0a12 12 0 0 0-12 12c0 8.6 10.3 19.4 11 20.1a1.4 1.4 0 0 0 2 0c.7-.7 11-11.5 11-20.1A12 12 0 0 0 12 0Z"
            fill="var(--brand-deep)"
          />
          <circle cx="12" cy="12" r="4.4" fill="#ffffff" />
        </g>
      </svg>
      <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
        Карта-заглушка
      </p>
    </div>
  )
}

const socials = [
  {
    label: 'Мессенджер клиники',
    path: 'M20.5 12c0 4.1-3.8 7.4-8.5 7.4-1 0-2-.15-2.9-.42L4 20.5l1.6-4.2A6.9 6.9 0 0 1 3.5 12C3.5 7.9 7.3 4.6 12 4.6s8.5 3.3 8.5 7.4Z',
  },
  {
    label: 'Фотогалерея клиники',
    path: 'M4 8.5h3l1.4-2h7.2l1.4 2h3v11H4v-11Zm8 8.2a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z',
  },
  {
    label: 'Видео о клинике',
    path: 'M4 6.5h16v11H4v-11Zm6.2 2.8v5.4l4.6-2.7-4.6-2.7Z',
  },
  {
    label: 'Клиника на карте',
    path: 'M12 3.2a6 6 0 0 0-6 6c0 4.3 5.2 10.4 5.4 10.7a.8.8 0 0 0 1.2 0c.2-.3 5.4-6.4 5.4-10.7a6 6 0 0 0-6-6Zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Z',
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-white pt-20">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <div className="relative inline-block">
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                Bright Smile{' '}
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-brand">
                Studio
              </span>
              <SmileArc
                className="absolute -bottom-2 left-0 h-3 w-full text-mint"
                strokeWidth={6}
              />
            </div>

            <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              {clinic.tagline}. Приём по записи, консультация перед любым лечением.
            </p>

            <dl className="mt-8 space-y-4 text-[15px]">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-deep">
                  Телефон
                </dt>
                <dd className="mt-1">
                  <a
                    href={clinic.phoneHref}
                    className="text-ink underline-offset-4 hover:text-brand-deep hover:underline"
                  >
                    {clinic.phoneLabel}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-deep">
                  Почта
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${clinic.email}`}
                    className="text-ink underline-offset-4 hover:text-brand-deep hover:underline"
                  >
                    {clinic.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-deep">
                  Адрес
                </dt>
                <dd className="mt-1 text-ink">{clinic.address}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-deep">
                  Часы работы
                </dt>
                <dd className="mt-1 space-y-1 text-ink">
                  {clinic.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days} — {h.time}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <ul className="mt-8 flex gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <motion.a
                    href="#booking"
                    aria-label={`${s.label} (ссылка-заглушка)`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-brand hover:text-brand-deep"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path d={s.path} />
                    </svg>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-10">
            <MapPlaceholder />

            <div className="grid gap-8 sm:grid-cols-2">
              <nav aria-label="Разделы сайта">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-deep">
                  Разделы
                </h2>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="text-ink-soft underline-offset-4 transition-colors hover:text-brand-deep hover:underline"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#booking"
                      className="text-ink-soft underline-offset-4 transition-colors hover:text-brand-deep hover:underline"
                    >
                      Запись на приём
                    </a>
                  </li>
                </ul>
              </nav>

              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-deep">
                  Услуги
                </h2>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {services.map((s) => (
                    <li key={s.id}>
                      <a
                        href="#services"
                        className="text-ink-soft underline-offset-4 transition-colors hover:text-brand-deep hover:underline"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Bright Smile Studio — вымышленная клиника.</p>
          <p className="max-w-xl sm:text-right">
            Демонстрационный макет. Название, адрес, телефон, отзывы и статистика
            придуманы; формы ничего не отправляют.
          </p>
        </div>
      </div>
    </footer>
  )
}
