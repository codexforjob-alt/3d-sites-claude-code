'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clinic, nav } from '@/lib/content'
import { SmileArc } from './SmileArc'
import { useMotionPref } from './MotionProvider'

function Wordmark() {
  return (
    <a
      href="#top"
      className="group relative inline-flex items-baseline gap-2 font-display text-lg font-bold tracking-tight"
      aria-label={`${clinic.name} — на главную`}
    >
      <span className="text-ink">Bright Smile</span>
      <span className="text-brand">Studio</span>
      <SmileArc
        className="absolute -bottom-1.5 left-0 h-2 w-[86px] text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        strokeWidth={5}
      />
    </a>
  )
}

function PauseIcon({ paused }: { paused: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden
    >
      {paused ? (
        <path d="M8 5.5 18.5 12 8 18.5V5.5Z" />
      ) : (
        <>
          <path d="M9.5 5.5v13M14.5 5.5v13" />
        </>
      )}
    </svg>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { paused, togglePaused } = useMotionPref()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-line bg-white/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-2 text-ink-soft transition-colors hover:text-brand-deep"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={togglePaused}
            aria-pressed={paused}
            title={paused ? 'Включить анимацию' : 'Остановить анимацию'}
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-brand hover:text-brand-deep sm:inline-flex"
          >
            <PauseIcon paused={paused} />
            <span className="sr-only">
              {paused ? 'Включить анимацию и видео' : 'Остановить анимацию и видео'}
            </span>
          </button>

          <a
            href={clinic.phoneHref}
            className="hidden text-sm font-medium text-ink transition-colors hover:text-brand-deep md:inline"
          >
            {clinic.phoneLabel}
          </a>

          <motion.a
            href="#booking"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="hidden cursor-pointer rounded-full bg-brand-deep px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand sm:inline-block"
          >
            Записаться
          </motion.a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors lg:hidden"
          >
            <span className="sr-only">{open ? 'Закрыть меню' : 'Открыть меню'}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden
            >
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3.5 text-base text-ink transition-colors hover:bg-mint-50"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex gap-3">
                <a
                  href="#booking"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-brand-deep px-5 py-3.5 text-center text-sm font-semibold text-white"
                >
                  Записаться
                </a>
                <button
                  type="button"
                  onClick={togglePaused}
                  aria-pressed={paused}
                  className="inline-flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-line text-ink-soft"
                >
                  <PauseIcon paused={paused} />
                  <span className="sr-only">
                    {paused ? 'Включить анимацию' : 'Остановить анимацию'}
                  </span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
