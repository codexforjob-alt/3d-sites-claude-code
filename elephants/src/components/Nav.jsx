import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#vitals', label: 'Vitals' },
  { href: '#herd', label: 'The Herd' },
  { href: '#notes', label: 'Field Notes' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-night/85 backdrop-blur-md border-b border-hairline' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[84rem] items-center justify-between px-6 py-4 md:px-10"
      >
        <a
          href="#top"
          className="font-display text-lg tracking-tight text-bone transition-colors duration-200 hover:text-ochre cursor-pointer"
        >
          MATRIARCH
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="eyebrow transition-colors duration-200 hover:text-bone cursor-pointer"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#support"
              className="inline-flex min-h-11 items-center rounded-full bg-ochre px-5 text-sm font-medium text-night transition-colors duration-200 hover:bg-bone cursor-pointer"
            >
              Fund a ranger
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-bone transition-colors duration-200 hover:border-ochre cursor-pointer md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            ) : (
              <path d="M2 5h14M2 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-hairline bg-night/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col px-6 py-2">
            {[...LINKS, { href: '#support', label: 'Fund a ranger' }].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-hairline/60 text-base text-bone transition-colors duration-200 hover:text-ochre cursor-pointer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
